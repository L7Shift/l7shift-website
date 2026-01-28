#!/usr/bin/env node

/**
 * Full Migration: Monday.com -> L7 Supabase
 * Migrates ALL tasks with full parity
 */

const fs = require('fs')

const SUPABASE_URL = 'https://xvdoorpshysqzphjkgbn.supabase.co'
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh2ZG9vcnBzaHlzcXpwaGprZ2JuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTM5MDU4NCwiZXhwIjoyMDg0OTY2NTg0fQ.OCNRJ8PbIgMVa2kV9TIY--gXE7dO5qXwGRnE2VK_wCI'

// Map Monday group names to L7 task statuses
const statusMap = {
  '✅ Shipped': 'shipped',
  'Shipped': 'shipped',
  '🏃 Active': 'active',
  'Active': 'active',
  '📋 Backlog': 'backlog',
  'Backlog': 'backlog',
  '🧊 Icebox': 'backlog', // Map icebox to backlog
  'Icebox': 'backlog',
  '👀 Review': 'review',
  'Review': 'review',
}

async function supabaseRequest(endpoint, method, body) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${endpoint}`, {
    method,
    headers: {
      'apikey': SUPABASE_SERVICE_KEY,
      'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': method === 'POST' ? 'return=representation' : 'return=minimal'
    },
    body: body ? JSON.stringify(body) : undefined
  })

  const text = await response.text()
  if (!response.ok) {
    throw new Error(`Supabase error: ${response.status} ${text}`)
  }
  return text ? JSON.parse(text) : null
}

function parseColumnValue(columnValues, columnId) {
  const col = columnValues.find(c => c.id === columnId)
  if (!col) return null

  // Try to parse the value JSON
  if (col.value) {
    try {
      const parsed = JSON.parse(col.value)
      return parsed.text || parsed
    } catch {
      return col.text || col.value
    }
  }
  return col.text || null
}

function extractHours(text) {
  if (!text) return null
  const num = parseFloat(text)
  return isNaN(num) ? null : num
}

async function migrate() {
  console.log('Starting FULL Monday.com -> L7 Supabase migration...\n')

  // Load Monday data
  const mondayData = JSON.parse(fs.readFileSync('/tmp/monday_work_board.json', 'utf8'))
  const items = mondayData.data.boards[0].items_page.items

  console.log(`Found ${items.length} total items in Monday.com\n`)

  // Get Scat Pack project ID
  const projects = await supabaseRequest('projects?name=eq.Scat%20Pack%20CLT&select=id', 'GET')
  if (!projects || projects.length === 0) {
    throw new Error('Scat Pack CLT project not found')
  }
  const scatPackId = projects[0].id
  console.log(`Scat Pack CLT project ID: ${scatPackId}\n`)

  // Delete existing tasks for this project
  console.log('Deleting existing tasks...')
  await supabaseRequest(`tasks?project_id=eq.${scatPackId}`, 'DELETE')
  console.log('  ✓ Existing tasks deleted\n')

  // Create L7 Shift Internal project if it doesn't exist
  console.log('Checking for L7 Shift Internal project...')
  const l7Projects = await supabaseRequest('projects?name=eq.L7%20Shift%20Internal&select=id', 'GET')
  let l7InternalId
  if (!l7Projects || l7Projects.length === 0) {
    console.log('  Creating L7 Shift Internal project...')
    const newProject = await supabaseRequest('projects', 'POST', {
      name: 'L7 Shift Internal',
      client_name: 'L7 Shift',
      status: 'active',
      description: 'Internal improvements and development for L7 Shift platform and tools.'
    })
    l7InternalId = newProject[0].id
    console.log(`  ✓ Created L7 Shift Internal project (ID: ${l7InternalId})\n`)
  } else {
    l7InternalId = l7Projects[0].id
    console.log(`  ✓ L7 Shift Internal project exists (ID: ${l7InternalId})\n`)
  }

  // Group items by Monday group
  const grouped = {}
  for (const item of items) {
    const groupTitle = item.group.title
    if (!grouped[groupTitle]) grouped[groupTitle] = []
    grouped[groupTitle].push(item)
  }

  // Stats
  const stats = { created: 0, errors: 0 }
  const statusCounts = { shipped: 0, active: 0, review: 0, backlog: 0 }

  // Process all items
  console.log('Migrating tasks...\n')

  for (const [groupTitle, groupItems] of Object.entries(grouped)) {
    const status = statusMap[groupTitle] || 'backlog'
    console.log(`Processing ${groupTitle} (${groupItems.length} items) -> ${status}`)

    for (const item of groupItems) {
      // Extract column values
      const shiftHours = extractHours(parseColumnValue(item.column_values, 'numeric_mkzy1zqw')) || 2
      const traditionalHours = shiftHours * 4 // Default 4x multiplier
      const description = parseColumnValue(item.column_values, 'long_text_mkzy12yg') || ''

      const task = {
        project_id: scatPackId,
        title: item.name,
        description: description,
        status: status,
        shift_hours: shiftHours,
        traditional_hours_estimate: traditionalHours,
        shipped_at: status === 'shipped' ? new Date().toISOString() : null,
      }

      try {
        await supabaseRequest('tasks', 'POST', task)
        stats.created++
        statusCounts[status]++
      } catch (error) {
        console.error(`    ✗ Failed: ${item.name.substring(0, 40)}... - ${error.message}`)
        stats.errors++
      }
    }
    console.log(`  ✓ ${groupItems.length} tasks processed\n`)
  }

  // Summary
  console.log('='.repeat(60))
  console.log('Migration Complete!')
  console.log('='.repeat(60))
  console.log(`\nTasks created: ${stats.created}`)
  console.log(`Errors: ${stats.errors}`)
  console.log(`\nBy status:`)
  console.log(`  Shipped: ${statusCounts.shipped}`)
  console.log(`  Active: ${statusCounts.active}`)
  console.log(`  Review: ${statusCounts.review}`)
  console.log(`  Backlog: ${statusCounts.backlog}`)

  // Calculate totals
  const totalShift = items.reduce((sum, item) => {
    const hours = extractHours(parseColumnValue(item.column_values, 'numeric_mkzy1zqw')) || 2
    return sum + hours
  }, 0)

  console.log(`\nTotal Shift Hours: ${totalShift}h`)
  console.log(`Traditional Estimate: ${totalShift * 4}h`)
  console.log(`Time Savings: ${((totalShift * 4 - totalShift) / (totalShift * 4) * 100).toFixed(0)}%`)
}

migrate().catch(console.error)

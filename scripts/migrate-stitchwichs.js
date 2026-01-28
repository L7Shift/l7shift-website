#!/usr/bin/env node

/**
 * Migrate Stitchwichs tasks from Monday.com to L7 Supabase
 */

const fs = require('fs')

const SUPABASE_URL = 'https://xvdoorpshysqzphjkgbn.supabase.co'
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh2ZG9vcnBzaHlzcXpwaGprZ2JuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTM5MDU4NCwiZXhwIjoyMDg0OTY2NTg0fQ.OCNRJ8PbIgMVa2kV9TIY--gXE7dO5qXwGRnE2VK_wCI'

// Map Monday group names to L7 task statuses
// Stitchwichs uses phases, map them based on status column
const statusMap = {
  'Done': 'shipped',
  'Working on it': 'active',
  'Stuck': 'review',
  // Default to backlog for tasks without status
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

  if (col.value) {
    try {
      const parsed = JSON.parse(col.value)
      return parsed.text || parsed.label || parsed
    } catch {
      return col.text || col.value
    }
  }
  return col.text || null
}

function getStatusFromColumns(columnValues) {
  // Stitchwichs uses color_mkzzw5k9 as the status column
  const statusCol = columnValues.find(c => c.id === 'color_mkzzw5k9')
  if (statusCol && statusCol.text) {
    return statusMap[statusCol.text] || 'backlog'
  }
  return 'backlog'
}

async function migrate() {
  console.log('Starting Stitchwichs Monday.com -> L7 Supabase migration...\n')

  // Load Monday data
  const mondayData = JSON.parse(fs.readFileSync('/tmp/monday_stitchwichs.json', 'utf8'))
  const items = mondayData.data.boards[0].items_page.items

  console.log(`Found ${items.length} items in Stitchwichs board\n`)

  // Get Stitchwichs project ID
  const projects = await supabaseRequest('projects?name=eq.Stitchwichs%20Custom%20Apparel&select=id', 'GET')
  if (!projects || projects.length === 0) {
    throw new Error('Stitchwichs Custom Apparel project not found in L7 database')
  }
  const stitchwichsId = projects[0].id
  console.log(`Stitchwichs project ID: ${stitchwichsId}\n`)

  // Delete existing tasks for this project (clean migration)
  console.log('Deleting existing Stitchwichs tasks...')
  await supabaseRequest(`tasks?project_id=eq.${stitchwichsId}`, 'DELETE')
  console.log('  ✓ Existing tasks deleted\n')

  // Stats
  const stats = { created: 0, errors: 0 }
  const statusCounts = { shipped: 0, active: 0, review: 0, backlog: 0 }

  console.log('Migrating tasks...\n')

  for (const item of items) {
    const phase = item.group.title
    const status = getStatusFromColumns(item.column_values)

    // Get notes/description (Stitchwichs uses long_text_mkzz61sj)
    const notes = parseColumnValue(item.column_values, 'long_text_mkzz61sj') || ''

    // Get savings if present (Stitchwichs uses text_mkzzty6h)
    const savings = parseColumnValue(item.column_values, 'text_mkzzty6h') || ''

    // Build description with phase and savings info
    let description = `Phase: ${phase}`
    if (notes) description += `\n\n${notes}`
    if (savings) description += `\n\nSavings: ${savings}`

    const task = {
      project_id: stitchwichsId,
      title: item.name,
      description: description,
      status: status,
      shift_hours: 2, // Default 2 hours per task
      traditional_hours_estimate: 8, // Default 4x multiplier
      shipped_at: status === 'shipped' ? new Date().toISOString() : null,
    }

    try {
      await supabaseRequest('tasks', 'POST', task)
      stats.created++
      statusCounts[status]++
      console.log(`  ✓ ${item.name.substring(0, 50)}... [${status}]`)
    } catch (error) {
      console.error(`  ✗ Failed: ${item.name.substring(0, 40)}... - ${error.message}`)
      stats.errors++
    }
  }

  // Summary
  console.log('\n' + '='.repeat(60))
  console.log('Stitchwichs Migration Complete!')
  console.log('='.repeat(60))
  console.log(`\nTasks created: ${stats.created}`)
  console.log(`Errors: ${stats.errors}`)
  console.log(`\nBy status:`)
  console.log(`  Shipped: ${statusCounts.shipped}`)
  console.log(`  Active: ${statusCounts.active}`)
  console.log(`  Review: ${statusCounts.review}`)
  console.log(`  Backlog: ${statusCounts.backlog}`)
}

migrate().catch(console.error)

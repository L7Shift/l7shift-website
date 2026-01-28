#!/usr/bin/env node

/**
 * Migration script: Monday.com -> L7 Supabase
 * Migrates clients from Client Pipeline and tasks from Work Board
 */

const SUPABASE_URL = 'https://xvdoorpshysqzphjkgbn.supabase.co'
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh2ZG9vcnBzaHlzcXpwaGprZ2JuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTM5MDU4NCwiZXhwIjoyMDg0OTY2NTg0fQ.OCNRJ8PbIgMVa2kV9TIY--gXE7dO5qXwGRnE2VK_wCI'

// Client Pipeline data from Monday.com
const clients = [
  {
    name: 'Scat Pack CLT',
    client_name: 'Ken Leftwich',
    status: 'active',
    description: 'Pet waste removal SaaS platform for Charlotte, NC. Full-stack Next.js application with Stripe billing, crew management, and route optimization.',
    monday_board_id: '18397124290'
  },
  {
    name: 'Stitchwichs Custom Apparel',
    client_name: 'Nicole Walker',
    status: 'proposal',
    description: 'POC Client #1 - Custom apparel, embroidery, sublimation in Charlotte NC. 8-phase Shopify optimization engagement.',
    monday_board_id: null
  },
  {
    name: 'Pretty Paid Closet',
    client_name: 'Jazz',
    status: 'proposal',
    description: 'Partnership model - Revenue share: 15% consignment, 10% services. Consignment + closet org + donation program.',
    monday_board_id: null
  }
]

// Work Board tasks from Monday.com (Scat Pack project)
const mondayTasks = [
  // Shipped tasks
  { name: '[GN-001] Next.js project setup', group: 'Shipped', hours: 2, desc: 'Completed and deployed to production.' },
  { name: '[GN-002] Supabase database schema', group: 'Shipped', hours: 4, desc: 'Completed and deployed to production.' },
  { name: '[BL-001] Stripe subscription integration', group: 'Shipped', hours: 6, desc: 'Completed and deployed to production.' },
  { name: '[CP-001] Crew mobile portal', group: 'Shipped', hours: 16, desc: 'Completed and deployed to production.' },
  { name: '[OP-001] Email automation (Resend)', group: 'Shipped', hours: 4, desc: 'Completed and deployed to production.' },
  { name: '[GN-003] Google Ads campaigns', group: 'Shipped', hours: 4, desc: 'Completed and deployed to production.' },
  { name: '[GN-004] Set up Next.js project with TypeScript', group: 'Shipped', hours: 2, desc: 'Completed and deployed to production.' },
  { name: '[GN-005] Configure Tailwind CSS', group: 'Shipped', hours: 2, desc: 'Completed and deployed to production.' },
  { name: '[GN-006] Set up Supabase project', group: 'Shipped', hours: 2, desc: 'Completed and deployed to production.' },
  { name: '[GN-007] Configure environment variables', group: 'Shipped', hours: 2, desc: 'Completed and deployed to production.' },
  { name: '[GN-008] Set up Vercel deployment', group: 'Shipped', hours: 2, desc: 'Completed and deployed to production.' },
  { name: '[GN-009] Configure Cloudflare DNS', group: 'Shipped', hours: 2, desc: 'Completed and deployed to production.' },
  { name: '[GN-010] Set up GitHub repository', group: 'Shipped', hours: 2, desc: 'Completed and deployed to production.' },
  { name: '[GN-011] Create customers table schema', group: 'Shipped', hours: 8, desc: 'Completed and deployed to production.' },
  { name: '[GN-012] Create territories table', group: 'Shipped', hours: 8, desc: 'Completed and deployed to production.' },
  { name: '[OP-002] Create territory_slots table', group: 'Shipped', hours: 8, desc: 'Completed and deployed to production.' },
  { name: '[GN-013] Create shifts table', group: 'Shipped', hours: 8, desc: 'Completed and deployed to production.' },
  { name: '[OP-003] Create customer_schedules table', group: 'Shipped', hours: 8, desc: 'Completed and deployed to production.' },
  { name: '[OP-004] Create scheduled_visits table', group: 'Shipped', hours: 8, desc: 'Completed and deployed to production.' },
  { name: '[CR-001] Create crew_members table', group: 'Shipped', hours: 8, desc: 'Completed and deployed to production.' },
  { name: '[GN-014] Create commissions table', group: 'Shipped', hours: 8, desc: 'Completed and deployed to production.' },
  { name: '[MK-001] Create referrals table', group: 'Shipped', hours: 8, desc: 'Completed and deployed to production.' },
  { name: '[GN-015] Set up Row Level Security policies', group: 'Shipped', hours: 2, desc: 'Completed and deployed to production.' },
  { name: '[GN-016] Build homepage with hero section', group: 'Shipped', hours: 8, desc: 'Completed and deployed to production.' },
  { name: '[GN-017] Create How It Works section', group: 'Shipped', hours: 8, desc: 'Completed and deployed to production.' },
]

// Map Monday group names to L7 task statuses
const statusMap = {
  'Shipped': 'shipped',
  '✅ Shipped': 'shipped',
  'Active': 'active',
  '🏃 Active': 'active',
  'Backlog': 'backlog',
  '📋 Backlog': 'backlog',
  'Icebox': 'icebox',
  '🧊 Icebox': 'icebox'
}

async function supabaseRequest(endpoint, method, body) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${endpoint}`, {
    method,
    headers: {
      'apikey': SUPABASE_SERVICE_KEY,
      'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    },
    body: body ? JSON.stringify(body) : undefined
  })

  const text = await response.text()
  if (!response.ok) {
    throw new Error(`Supabase error: ${response.status} ${text}`)
  }
  return text ? JSON.parse(text) : null
}

async function migrate() {
  console.log('Starting migration from Monday.com to L7 Supabase...\n')

  // 1. Create projects
  console.log('Creating projects...')
  const projectResults = []

  for (const client of clients) {
    const project = {
      name: client.name,
      client_name: client.client_name,
      status: client.status,
      description: client.description,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    try {
      const result = await supabaseRequest('projects', 'POST', project)
      console.log(`  ✓ Created project: ${client.name}`)
      projectResults.push({ ...client, id: result[0].id })
    } catch (error) {
      console.error(`  ✗ Failed to create project ${client.name}:`, error.message)
    }
  }

  // 2. Get Scat Pack project ID for tasks
  const scatPackProject = projectResults.find(p => p.name === 'Scat Pack CLT')

  if (!scatPackProject) {
    console.error('\nCould not find Scat Pack project. Skipping task migration.')
    return
  }

  // 3. Create tasks for Scat Pack
  console.log('\nCreating tasks for Scat Pack CLT...')
  let totalShiftHours = 0
  let taskCount = 0

  for (const mondayTask of mondayTasks) {
    const status = statusMap[mondayTask.group] || 'backlog'
    const shiftHours = mondayTask.hours || 2
    // Traditional estimate is typically 3-5x shift hours for AI-assisted work
    const traditionalHours = Math.round(shiftHours * 4)

    const task = {
      project_id: scatPackProject.id,
      title: mondayTask.name,
      description: mondayTask.desc,
      status: status,
      shift_hours: shiftHours,
      traditional_hours_estimate: traditionalHours,
      shipped_at: status === 'shipped' ? '2026-01-25T12:00:00Z' : null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    try {
      await supabaseRequest('tasks', 'POST', task)
      console.log(`  ✓ Created task: ${mondayTask.name.substring(0, 40)}...`)
      totalShiftHours += shiftHours
      taskCount++
    } catch (error) {
      console.error(`  ✗ Failed to create task ${mondayTask.name}:`, error.message)
    }
  }

  // 4. Log activity
  console.log('\nLogging migration activity...')
  const activity = {
    entity_type: 'project',
    entity_id: scatPackProject.id,
    action: 'migration_completed',
    actor: 'System',
    actor_type: 'internal',
    metadata: { source: 'monday.com', tasks_migrated: taskCount },
    created_at: new Date().toISOString()
  }

  try {
    await supabaseRequest('activity_log', 'POST', activity)
    console.log('  ✓ Activity logged')
  } catch (error) {
    console.error('  ✗ Failed to log activity:', error.message)
  }

  // Summary
  console.log('\n' + '='.repeat(50))
  console.log('Migration Complete!')
  console.log('='.repeat(50))
  console.log(`Projects created: ${projectResults.length}`)
  console.log(`Tasks created: ${taskCount}`)
  console.log(`Total Shift Hours: ${totalShiftHours}`)
  console.log(`Total Traditional Hours Estimate: ${totalShiftHours * 4}`)
  console.log(`Time Savings: ${((totalShiftHours * 4 - totalShiftHours) / (totalShiftHours * 4) * 100).toFixed(0)}%`)
}

migrate().catch(console.error)

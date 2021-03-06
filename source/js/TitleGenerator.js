import Utils from './Utils'

export default {

  randomTitle () {
    var one = [
      'Lead',
      'Senior',
      'Direct',
      'Corporate',
      'Dynamic',
      'Future',
      'Product',
      'National',
      'Regional',
      'District',
      'Central',
      'Global',
      'Customer',
      'Investor',
      'Dynamic',
      'International',
      'Legacy',
      'Forward',
      'Internal',
      'Human',
      'Chief',
      'Principal'
    ]

    var two = [
      'Solutions',
      'Program',
      'Brand',
      'Security',
      'Research',
      'Marketing',
      'Directives',
      'Implementation',
      'Integration',
      'Functionality',
      'Response',
      'Paradigm',
      'Tactics',
      'Identity',
      'Markets',
      'Group',
      'Division',
      'Applications',
      'Optimization',
      'Operations',
      'Infrastructure',
      'Intranet',
      'Communications',
      'Web',
      'Branding',
      'Quality',
      'Assurance',
      'Mobility',
      'Accounts',
      'Data',
      'Creative',
      'Configuration',
      'Accountability',
      'Interactions',
      'Factors',
      'Usability',
      'Metrics'
    ]

    var three = [
      'Supervisor',
      'Associate',
      'Executive',
      'Liason',
      'Officer',
      'Manager',
      'Engineer',
      'Specialist',
      'Director',
      'Coordinator',
      'Administrator',
      'Architect',
      'Analyst',
      'Designer',
      'Planner',
      'Orchestrator',
      'Technician',
      'Developer',
      'Producer',
      'Consultant',
      'Assistant',
      'Facilitator',
      'Agent',
      'Representative',
      'Strategist'
    ]

    return `${Utils.randomItem(one)} ${Utils.randomItem(two)} ${Utils.randomItem(three)}`
  }
}

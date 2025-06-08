// constants/pico.ts - PICO Constants

import { Users, Activity, Target, TrendingUp, CheckSquare } from 'lucide-react';
import { PICOCategoryConfig, PICOData } from '../types/pico';

export const PICO_CATEGORIES: PICOCategoryConfig[] = [
  { 
    key: 'population', 
    title: 'Population', 
    icon: Users, 
    color: 'blue',
    description: 'Patient characteristics and demographics'
  },
  { 
    key: 'intervention', 
    title: 'Intervention', 
    icon: Activity, 
    color: 'green',
    description: 'Treatment or exposure being studied'
  },
  { 
    key: 'comparator', 
    title: 'Comparator', 
    icon: Target, 
    color: 'orange',
    description: 'Control or comparison group'
  },
  { 
    key: 'outcome', 
    title: 'Outcome', 
    icon: TrendingUp, 
    color: 'purple',
    description: 'Measured results or endpoints'
  },
  { 
    key: 'others', 
    title: 'Others', 
    icon: CheckSquare, 
    color: 'gray',
    description: 'Study design and other criteria'
  }
];

export const DEFAULT_PICO_DATA: PICOData = {
  population: {
    inclusions: [
      {
        id: 'pop_inc_1',
        text: 'Adult patients with advanced or metastatic pancreatic cancer',
        order: 0
      }
    ],
    exclusions: [
      {
        id: 'pop_exc_1',
        text: 'Studies that do not include pancreatic cancer patients',
        order: 0
      },
      {
        id: 'pop_exc_2',
        text: 'Studies exclusively involving early stage, operable pancreatic cancer patients',
        order: 1
      },
      {
        id: 'pop_exc_3',
        text: 'Studies exclusively focused on pediatric pancreatic cancer patients',
        order: 2
      }
    ]
  },
  intervention: {
    inclusions: [
      {
        id: 'int_inc_1',
        text: 'Any therapeutic intervention for pancreatic cancer',
        order: 0
      },
      {
        id: 'int_inc_2',
        text: 'Chemotherapy, targeted therapy, immunotherapy, or combination regimens',
        order: 1
      }
    ],
    exclusions: [
      {
        id: 'int_exc_1',
        text: 'Studies without active treatment intervention',
        order: 0
      },
      {
        id: 'int_exc_2',
        text: 'Diagnostic or screening studies only',
        order: 1
      }
    ]
  },
  comparator: {
    inclusions: [
      {
        id: 'comp_inc_1',
        text: 'Placebo-controlled studies',
        order: 0
      },
      {
        id: 'comp_inc_2',
        text: 'Active comparator studies',
        order: 1
      },
      {
        id: 'comp_inc_3',
        text: 'Historical control studies',
        order: 2
      }
    ],
    exclusions: [
      {
        id: 'comp_exc_1',
        text: 'Single-arm studies without comparison group',
        order: 0
      }
    ]
  },
  outcome: {
    inclusions: [
      {
        id: 'out_inc_1',
        text: 'Economic evaluation metrics',
        order: 0
      },
      {
        id: 'out_inc_2',
        text: 'Incremental cost-effectiveness ratio',
        order: 1
      },
      {
        id: 'out_inc_3',
        text: 'Quality-adjusted life-years',
        order: 2
      },
      {
        id: 'out_inc_4',
        text: 'Healthcare utilization costs (direct or indirect)',
        order: 3
      },
      {
        id: 'out_inc_5',
        text: 'Burden of illness',
        order: 4
      }
    ],
    exclusions: [
      {
        id: 'out_exc_1',
        text: 'Studies that do not report any economic outcomes',
        order: 0
      }
    ]
  },
  others: {
    inclusions: [
      {
        id: 'oth_inc_1',
        text: 'Randomized controlled trials',
        order: 0
      },
      {
        id: 'oth_inc_2',
        text: 'Prospective cohort studies',
        order: 1
      },
      {
        id: 'oth_inc_3',
        text: 'Systematic reviews and meta-analyses',
        order: 2
      }
    ],
    exclusions: [
      {
        id: 'oth_exc_1',
        text: 'Case reports, editorials, letters, commentaries',
        order: 0
      },
      {
        id: 'oth_exc_2',
        text: 'Pre-clinical or animal studies',
        order: 1
      }
    ]
  }
};

export const PICO_COLOR_CLASSES = {
  blue: {
    bg: 'border-blue-200 bg-blue-50',
    text: 'text-blue-700',
    button: 'bg-blue-600 hover:bg-blue-700'
  },
  green: {
    bg: 'border-green-200 bg-green-50',
    text: 'text-green-700',
    button: 'bg-green-600 hover:bg-green-700'
  },
  orange: {
    bg: 'border-orange-200 bg-orange-50',
    text: 'text-orange-700',
    button: 'bg-orange-600 hover:bg-orange-700'
  },
  purple: {
    bg: 'border-purple-200 bg-purple-50',
    text: 'text-purple-700',
    button: 'bg-purple-600 hover:bg-purple-700'
  },
  gray: {
    bg: 'border-gray-200 bg-gray-50',
    text: 'text-gray-700',
    button: 'bg-gray-600 hover:bg-gray-700'
  }
} as const;
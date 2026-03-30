import { Box, Text } from 'ink';
import SelectInput from 'ink-select-input';
import type { CategoryInfo, StepCategory } from '../types.ts';

function Indicator({ isSelected = false }: { isSelected?: boolean }) {
  return <Box marginRight={1}><Text>{isSelected ? '›' : ' '}</Text></Box>;
}

function Item({ label, isSelected = false }: { label: string; isSelected?: boolean }) {
  return <Text bold={isSelected} dimColor={!isSelected}>{label}</Text>;
}

interface Props {
  categories: CategoryInfo[];
  onSelect: (categoryId: StepCategory | 'all') => void;
}

export default function CategoryList({ categories, onSelect }: Props) {
  const items = [
    { label: `Run All (${categories.reduce((n, c) => n + c.steps.length, 0)} steps)`, value: 'all' as const },
    ...categories.map(c => ({
      label: `${c.title} — ${c.steps.length} steps`,
      value: c.id,
    })),
  ];

  return (
    <Box flexDirection="column">
      <Box marginBottom={1} marginLeft={2}>
        <Text bold>Select an option:</Text>
      </Box>
      <Box marginLeft={2}>
        <SelectInput
          items={items}
          indicatorComponent={Indicator}
          itemComponent={Item}
          onSelect={(item: { value: StepCategory | 'all' }) => onSelect(item.value)}
        />
      </Box>
    </Box>
  );
}

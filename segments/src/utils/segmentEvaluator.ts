import type { Segment, Group, Condition } from '../types/segment';
import type { Account, Contact } from '../types/accountContact';
import { ACCOUNT_STORAGE_KEY, CONTACT_STORAGE_KEY } from '../types/accountContact';
import { getFromStorage } from './storage';

// 评估单个条件
const evaluateCondition = <T extends Account | Contact>(item: T, condition: Condition): boolean => {
  const { attribute, operator, value } = condition;
  const itemValue = item[attribute as keyof T];
  
  if (itemValue === undefined) return false;
  
  switch (operator) {
    case '=':
      return itemValue === value;
    case '!=':
      return itemValue !== value;
    case '>':
      return typeof itemValue === 'number' && typeof value === 'number' ? itemValue > value : false;
    case '<':
      return typeof itemValue === 'number' && typeof value === 'number' ? itemValue < value : false;
    case '>=':
      return typeof itemValue === 'number' && typeof value === 'number' ? itemValue >= value : false;
    case '<=':
      return typeof itemValue === 'number' && typeof value === 'number' ? itemValue <= value : false;
    case 'contains':
      return typeof itemValue === 'string' && typeof value === 'string' ? itemValue.toLowerCase().includes(value.toLowerCase()) : false;
    case 'not_contains':
      return typeof itemValue === 'string' && typeof value === 'string' ? !itemValue.toLowerCase().includes(value.toLowerCase()) : false;
    case 'starts_with':
      return typeof itemValue === 'string' && typeof value === 'string' ? itemValue.toLowerCase().startsWith(value.toLowerCase()) : false;
    case 'ends_with':
      return typeof itemValue === 'string' && typeof value === 'string' ? itemValue.toLowerCase().endsWith(value.toLowerCase()) : false;
    default:
      return false;
  }
};

// 递归评估组和子组
const evaluateGroupRecursive = <T extends Account | Contact>(group: Group, items: T[]): Set<string> => {
  // 评估当前组的条件
  let matchingIds = new Set<string>();
  
  items.forEach(item => {
    let allConditionsMet = true;
    
    // 评估当前组的所有条件
    for (const condition of group.conditions) {
      if (!evaluateCondition(item, condition)) {
        allConditionsMet = false;
        break;
      }
    }
    
    if (allConditionsMet) {
      matchingIds.add(item.id);
    }
  });
  
  // 递归评估子组
  if (group.subgroups.length > 0) {
    group.subgroups.forEach(subgroup => {
      const subgroupMatchingIds = evaluateGroupRecursive(subgroup, items);
      
      if (group.logicalOperator === 'and') {
        // AND 逻辑：取交集
        const intersection = new Set<string>();
        matchingIds.forEach(id => {
          if (subgroupMatchingIds.has(id)) {
            intersection.add(id);
          }
        });
        matchingIds = intersection;
      } else {
        // OR 逻辑：取并集
        subgroupMatchingIds.forEach(id => {
          matchingIds.add(id);
        });
      }
    });
  }
  
  return matchingIds;
};

// 评估所有组
const evaluateAllGroups = <T extends Account | Contact>(groups: Group[], items: T[]): Set<string> => {
  if (groups.length === 0) return new Set<string>();
  
  let allMatchingIds = evaluateGroupRecursive(groups[0], items);
  
  // 评估剩余的组，根据组的逻辑运算符组合结果
  for (let i = 1; i < groups.length; i++) {
    const groupMatchingIds = evaluateGroupRecursive(groups[i], items);
    
    // 组之间默认使用 AND 逻辑
    const intersection = new Set<string>();
    allMatchingIds.forEach(id => {
      if (groupMatchingIds.has(id)) {
        intersection.add(id);
      }
    });
    allMatchingIds = intersection;
  }
  
  return allMatchingIds;
};

export const calculateMembersCount = (segment: Segment): number => {
  try {
    // 根据 segment 的 audience 选择数据源
    let items: (Account | Contact)[] = [];
    
    if (segment.audience === 'contact') {
      items = getFromStorage<Contact>(CONTACT_STORAGE_KEY, []);
    } else {
      // 对于 leads 和 account，使用 account 数据
      items = getFromStorage<Account>(ACCOUNT_STORAGE_KEY, []);
    }
    
    if (segment.groups.length === 0) {
      return 0;
    }
    
    const matchingIds = evaluateAllGroups(segment.groups, items);
    return matchingIds.size;
  } catch (error) {
    console.error('Error calculating members count:', error);
    return 0;
  }
};

export const getMatchingMembers = (segment: Segment): (Account | Contact)[] => {
  try {
    // 根据 segment 的 audience 选择数据源
    let items: (Account | Contact)[] = [];
    
    if (segment.audience === 'contact') {
      items = getFromStorage<Contact>(CONTACT_STORAGE_KEY, []);
      console.log('Contact items from storage:', items);
    } else {
      // 对于 leads 和 account，使用 account 数据
      items = getFromStorage<Account>(ACCOUNT_STORAGE_KEY, []);
      console.log('Account items from storage:', items);
    }
    
    console.log('Segment groups:', segment.groups);
    
    if (segment.groups.length === 0) {
      console.log('No groups in segment');
      return [];
    }
    
    const matchingIds = evaluateAllGroups(segment.groups, items);
    console.log('Matching IDs:', matchingIds);
    
    // 返回匹配的客户信息
    const matchingItems = items.filter(item => matchingIds.has(item.id));
    console.log('Matching items:', matchingItems);
    return matchingItems;
  } catch (error) {
    console.error('Error getting matching members:', error);
    return [];
  }
};

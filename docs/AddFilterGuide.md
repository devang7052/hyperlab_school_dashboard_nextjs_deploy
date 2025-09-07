# Filter System Documentation

## Overview
The filter system in this application uses a centralized, type-safe approach to filter student data. This guide explains how to add new filters to the system.

## Current Filter Architecture

### Core Components
1. **FilterType Enum** - Defines available filter types
2. **FilterState Interface** - Manages filter values
3. **FILTER_DEFINITIONS Array** - Contains filter logic
4. **applyFilters Function** - Applies all filters to data

### Current Filter Types
- **STANDARD** - Single-value filter for class/standard selection
- **SECTION** - Single-value filter for section selection  
- **PAYMENT_STATUS** - Multi-value filter for payment status (checkboxes)
- **GENDER** - Multi-value filter for gender (checkboxes)
- **BMI** - Multi-value filter for BMI categories (checkboxes)

### Data Flow
```
User Input → Filter State Update → Filter Application → UI Update
```

## Adding a New Filter: Step-by-Step Guide

Let's add an **"Age Group"** filter as an example.

### Step 1: Add Filter Type to Enum

**File: `app/utils/filterHelpers.ts`**

```typescript
export enum FilterType {
  STANDARD = 'standard',
  SECTION = 'section', 
  PAYMENT_STATUS = 'paymentStatus',
  GENDER = 'gender',
  AGE_GROUP = 'ageGroup', // ← ADD THIS
}
```

### Step 2: Update FilterState Interface

**File: `app/utils/filterHelpers.ts`**

```typescript
export interface FilterState {
  [FilterType.STANDARD]: string;
  [FilterType.SECTION]: string;
  [FilterType.PAYMENT_STATUS]: string[]; // Multi-select
  [FilterType.GENDER]: string[]; // Multi-select
  [FilterType.AGE_GROUP]: string[]; // ← ADD THIS (multi-select example)
}
```

### Step 3: Add Filter Definition with Logic

**File: `app/utils/filterHelpers.ts`**

```typescript
export const FILTER_DEFINITIONS: FilterDefinition[] = [
  // ... existing filters
  {
    type: FilterType.AGE_GROUP,
    predicate: (student, value) => {
      if (!Array.isArray(value) || value.length === 0) return true;
      
      const age = calculateAge(student.dateOfBirth);
      
      return value.some(ageGroup => {
        switch (ageGroup) {
          case 'child': return age >= 5 && age <= 12;
          case 'teen': return age >= 13 && age <= 17;
          case 'adult': return age >= 18;
          default: return false;
        }
      });
    }
  }
];
```

### Step 4: Update Initial Filter State

**File: `app/utils/filterHelpers.ts`**

```typescript
export const createInitialFilterState = (): FilterState => ({
  [FilterType.STANDARD]: '',
  [FilterType.SECTION]: '',
  [FilterType.PAYMENT_STATUS]: [],
  [FilterType.GENDER]: [],
  [FilterType.AGE_GROUP]: [], // ← ADD THIS
});
```

### Step 5: Add Legacy Key Mapping (if needed)

**File: `app/utils/filterHelpers.ts`**

```typescript
export const LEGACY_KEY_MAPPING: Record<string, FilterType> = {
  'overview1': FilterType.STANDARD,
  'overview2': FilterType.SECTION,
  'overview3': FilterType.PAYMENT_STATUS,
  'overview4': FilterType.AGE_GROUP, // ← ADD THIS
};
```

### Step 6: Add Helper Function (if needed)

**File: `app/utils/filterHelpers.ts`**

```typescript
/**
 * Calculate age from date of birth
 */
export const calculateAge = (dateOfBirth: Date | string): number => {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
};
```



### Step 7: Add Sidebar Filter Configuration

**File: `app/utils/dashboardConfig.ts`**

Add the sidebar filter options to your dashboard config:

```typescript
// Add to the filters array in your dashboard config
{
  key: 'sidebar_agegroup',
  value: 'child',
  label: 'Child (5-12)'
},
{
  key: 'sidebar_agegroup',
  value: 'teen', 
  label: 'Teen (13-17)'
},
{
  key: 'sidebar_agegroup',
  value: 'adult',
  label: 'Adult (18+)'
}
```

**Sidebar Filter Key Conventions:**
- `sidebar_gender` - For gender-based filters
- `sidebar_payment` - For payment status filters  
- `sidebar_bmi` - For BMI category filters
- `sidebar_[custom]` - For any custom filter type

### Step 8: Add UI Component to Left Sidebar

**File: `app/home/components/leftSidebar.tsx`**

The left sidebar automatically detects and renders filters based on config. To add a new filter:

```typescript
// 1. Add to expanded sections state
const [expandedSections, setExpandedSections] = useState({
  gender: true,
  paymentStatus: true,
  bmi: true,
  ageGroup: true, // ← ADD THIS
});

// 2. Update toggleSection function
const toggleSection = (section: 'gender' | 'paymentStatus' | 'bmi' | 'ageGroup') => {
  setExpandedSections(prev => ({
    ...prev,
    [section]: !prev[section]
  }));
};

// 3. Add memoized options from config
const ageGroupOptions = useMemo(() => 
  getFilterOptionsByKey(allFilters, 'sidebar_agegroup').map(option => ({
    value: option.value,
    label: option.label,
  })), [allFilters]
);

// 4. Add conditional FilterSection component
{hasFilterKey(allFilters, 'sidebar_agegroup') && (
  <FilterSection
    title="Age Group"
    isExpanded={expandedSections.ageGroup}
    onToggle={() => toggleSection('ageGroup')}
    options={ageGroupOptions}
    selectedValues={filterState[FilterType.AGE_GROUP]}
    onOptionChange={(value) => toggleMultiFilterValue(FilterType.AGE_GROUP, value)}
  />
)}
```

**Key Points:**
- Filters only show if configured in `dashboardConfig.ts`
- Uses `hasFilterKey()` to check if filter exists in config
- Uses `getFilterOptionsByKey()` to get options from config
- Automatically inherits styling from `FilterSection` component

### Step 9: Add UI Component to Student Table (if applicable)

**File: `app/home/components/studentTable.tsx`**

If you want to add inline filter controls to the student table header:

```typescript
// For dropdown filters in table header
<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
  <div className="flex items-center gap-2">
    Age Group
    <select
      value={filterState[FilterType.AGE_GROUP]}
      onChange={(e) => setFilterValue(FilterType.AGE_GROUP, e.target.value)}
      className="text-xs border rounded px-1 py-0.5"
    >
      <option value="">All</option>
      <option value="child">Child (5-12)</option>
      <option value="teen">Teen (13-17)</option>
      <option value="adult">Adult (18+)</option>
    </select>
  </div>
</th>
```



## Configuration-Based Filter System

### Dashboard-Specific Filter Behavior

The filter system respects dashboard configuration, meaning:

**School Dashboard** (`school` type):
- Shows: Gender, Payment Status, BMI filters
- Configuration keys: `sidebar_gender`, `sidebar_payment`, `sidebar_bmi`

**Army Dashboard** (`army` type):  
- Shows: Gender, Payment Status, BMI filters (same as school)
- Configuration keys: `sidebar_gender`, `sidebar_payment`, `sidebar_bmi`

**Academy Dashboard** (`academy` type):
- Shows: No sidebar filters (only table dropdowns)
- No sidebar filter keys configured

### Config-Based Conditional Rendering

```typescript
// Filter only shows if configured
{hasFilterKey(allFilters, 'sidebar_gender') && (
  <FilterSection ... />
)}

// Options come from config
const genderOptions = useMemo(() => 
  getFilterOptionsByKey(allFilters, 'sidebar_gender').map(option => ({
    value: option.value,
    label: option.label,
  })), [allFilters]
);
```

This ensures that each dashboard type shows only relevant filters while maintaining code reusability.

## Filter Types

### Single-Value Filters
Used for dropdown selections where only one value can be selected at a time.
- **FilterState Type**: `string`
- **Example**: STANDARD, SECTION

### Multi-Value Filters  
Used for checkbox selections where multiple values can be selected simultaneously.
- **FilterState Type**: `string[]`
- **Example**: PAYMENT_STATUS, GENDER
- **Use `toggleMultiFilterValue`** for checkbox interactions

## Best Practices

1. **Keep Predicates Pure** - No side effects
2. **Handle Edge Cases** - Empty values, null data
3. **Use TypeScript** - Leverage type safety
4. **Test Thoroughly** - Unit and integration tests
5. **Document Complex Logic** - Add JSDoc comments
6. **Consider Performance** - Optimize expensive operations
7. **Maintain Consistency** - Follow existing patterns

## Filter Naming Conventions

- **FilterType**: Use UPPER_SNAKE_CASE
- **Config Keys**: Use descriptive names (`overview1`, `overview2`, etc.)
- **Predicate Logic**: Keep simple and readable
- **UI Labels**: Use human-readable text

This system is designed to be extensible while maintaining type safety and performance. Each new filter follows the same pattern, making the codebase predictable and maintainable. 

## Firebase Value Matching

**CRITICAL**: Filter values in your `dashboardConfig.ts` must exactly match the values stored in Firebase:

### Current Firebase Enum Values:
- **Gender**: `"Gender.Male"`, `"Gender.Female"`
- **Payment Status**: `"PaymentStatus.paid"`, `"PaymentStatus.unpaid"`

### BMI Categories:
The BMI filter uses standard medical BMI categories:
- **Underweight**: BMI < 18.5
- **Normal**: BMI 18.5 - 24.9
- **Overweight**: BMI 25.0 - 29.9
- **Obese (Class 1)**: BMI 30.0 - 34.9
- **Obese (Class 2)**: BMI 35.0 - 39.9
- **Obese (Class 3)**: BMI ≥ 40.0

The system automatically categorizes students based on their `student.latestTest?.score?.bmi` value.

### Example Predicate Checks:
```typescript
// Gender Filter Example:
// When user selects "Male" checkbox:
// filterState[FilterType.GENDER] = ["Gender.Male"]
// Firebase student.gender = "Gender.Male"
// Predicate: value.includes(student.gender) 
// Result: ["Gender.Male"].includes("Gender.Male") = true ✅

// BMI Filter Example:
// When user selects "Normal" checkbox:
// filterState[FilterType.BMI] = ["normal"]
// Firebase student.latestTest?.score?.bmi = 22.5
// System calculates: getBMICategory(22.5) = "normal"
// Predicate: value.includes(bmiCategory)
// Result: ["normal"].includes("normal") = true ✅

// Multiple BMI Categories Example:
// When user selects both "Normal" and "Overweight":
// filterState[FilterType.BMI] = ["normal", "overweight"]
// Firebase student.latestTest?.score?.bmi = 27.8
// System calculates: getBMICategory(27.8) = "overweight"
// Predicate: value.includes(bmiCategory)
// Result: ["normal", "overweight"].includes("overweight") = true ✅
```

```
User Click 
    ↓
toggleMultiFilterValue() 
    ↓
toggleFilterValue() 
    ↓
filterState Updates 
    ↓
useMemo triggers 
    ↓
applyFilters() 
    ↓
FILTER_DEFINITIONS.predicate() 
    ↓
Filtered Array 
    ↓
useUIPagination() 
    ↓
UI Re-renders 
    ↓
User Sees Results

```
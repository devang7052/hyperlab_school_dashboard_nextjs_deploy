# How to Add a New Column to the Student Table

This guide outlines the step-by-step process for adding a new column to the student table in the school dashboard application.

Adding a new column involves modifications in several key areas to ensure the data is displayed correctly, is sortable (if required), and integrates seamlessly with the existing architecture.

---

## Step 1: Define the Column in `dashboardConfig.ts`

The table's column configuration is managed in `app/utils/dashboardConfig.ts`. You need to add a new `TableColumn` object to the `columns` array within the `tableConfig` section.

1.  **Open:** `app/utils/dashboardConfig.ts`
2.  **Locate:** The `tableConfig` interface and the `DEFAULT_DASHBOARD_CONFIG` constant.
3.  **Add your new column definition:**

    ```typescript
    // ... existing code ...
    export interface TableColumn {
      key: string; // Unique identifier for the column (e.g., 'newMetric')
      label: string; // Display name for the column (e.g., 'New Metric Score')
      enabled: boolean; // Whether the column is visible by default
      sortable: boolean; // Whether the column can be sorted
      width?: string; // Optional: Custom width for the column (e.g., 'w-[120px]')
    }

    // ... existing code ...

    export const DEFAULT_DASHBOARD_CONFIG: DashboardConfig = {
      // ... existing config ...
      tableConfig: {
        columns: [
          // ... existing columns ...
          { key: 'newMetric', label: 'New Metric', enabled: true, sortable: true, width: 'w-[120px]' },
          // Add your new column here
        ],
      },
      // ... rest of the config ...
    };
    ```
    *   **`key`**: This is crucial. It must be unique and will be used to reference the column in other parts of the code (e.g., when rendering cell content, for sorting).(should be same as the name used in the database)
    *   **`label`**: The text that will appear in the table header.
    *   **`enabled`**: Set to `true` to make it visible.
    *   **`sortable`**: Set to `true` if you want the column to be sortable. If `true`, further steps are required for sorting.
    *   **`width`**: (Optional) Use Tailwind CSS width classes (e.g., `w-[120px]`, `min-w-[100px]`, `flex-1`) to control column width.

---

## Step 2: Update Data Models (if necessary)

If the data for your new column is not already present in the `StudentWithTestData` interface (which combines `SchoolStudent` and `StudentLatestTest` data), you will need to update the relevant models.

1.  **Open:** `app/models/schoolStudent.ts` and/or `app/models/studentLatestTest.ts`
2.  **Locate:** The relevant interface (e.g., `SchoolStudent` or `StudentLatestTest`).
3.  **Add the new field to the interface:**

    ```typescript
    // Example: Adding 'newMetricValue' to StudentLatestTest
    // app/models/studentLatestTest.ts
    export interface StudentLatestTest {
      id: string;
      studentId: string;
      testDate: string;
      score: {
        overallScore: number;
        pushup?: number;
        plank?: number;
        chimpTest?: number; // Memory
        concentration?: number;
        fatigue?: number; // Speed
        coreBalance?: number;
        bodyControl?: number;
        bmi?: number;
        newMetricValue?: number; // Add your new field here
      };
      // ... other fields ...
    }
    ```
    *   Ensure the type matches your data (e.g., `string`, `number`, `boolean`, `Date`).
    *   Use `?` to make the field optional if it might not always be present.

4.  **Verify/Update `StudentWithTestData`**: The `StudentWithTestData` interface in `app/service/homeService.ts` combines these. Usually, if you update the underlying models, `StudentWithTestData` will automatically reflect the changes. However, if your new data requires specific aggregation or joins, you might need to adjust the service layer.

---

## Step 3: Implement Cell Rendering Logic in `studentTable.tsx`

This is where you define how the data for your new column will be displayed in each table row.

1.  **Open:** `app/home/components/studentTable.tsx`
2.  **Locate:** The `renderCellContent` function.
3.  **Add a new `case` statement for your column's `key`:**

    ```typescript
    // ... existing code ...
    const renderCellContent = (student: StudentWithTestData, columnKey: string) => {
      switch (columnKey) {
        // ... existing cases ...
        case 'newMetric': // Use the 'key' you defined in dashboardConfig.ts
          // Access your new data from the student object
          return student.latestTest?.score?.newMetricValue ? formatScore(student.latestTest.score.newMetricValue) : '-';
        default:
          return '-';
      }
    };
    ```
    *   **`case 'newMetric'`**: Replace `'newMetric'` with the `key` you defined in `dashboardConfig.ts`.
    *   **Return Value**: Define how the content should be rendered. This involves accessing the data from the `student` object and potentially formatting it using helper functions (e.g., `formatScore`). If the data is not available, return a placeholder like `'-'`.

---

## Step 4: Make the Column Sortable (if `sortable: true`)

If you set `sortable: true` for your new column in `dashboardConfig.ts`, you need to define how it should be sorted.

### a. Define the SortField

1.  **Open:** `app/utils/sortHelpers.ts`
2.  **Locate:** The `SortField` enum.
3.  **Add a new enum member for your column:**

    ```typescript
    // app/utils/sortHelpers.ts
    export enum SortField {
      NAME = 'name',
      PAYMENT_STATUS = 'paymentStatus',
      GENDER = 'gender',
      // ... existing fields ...
      NEW_METRIC = 'newMetric', // Add your new sort field here
    }
    ```
    *   Choose a clear, uppercase name for your enum member (e.g., `NEW_METRIC`).

### b. Update `getSortFieldForColumn`

This function maps the column's `key` to its corresponding `SortField`.
(Note: You recently moved `getSortFieldForColumn` to `app/utils/formatters.ts`. Please ensure you update it there.)

1.  **Open:** `app/utils/formatters.ts` (or `app/home/components/studentTable.tsx` if it's still there)
2.  **Locate:** The `getSortFieldForColumn` function.
3.  **Add your new column to the `sortFieldMap`:**

    ```typescript
    // app/utils/formatters.ts
    // ... existing code ...
    export const getSortFieldForColumn = (columnKey: string): SortField | null => {
      const sortFieldMap: Record<string, SortField> = {
        'name': SortField.NAME,
        'paymentStatus': SortField.PAYMENT_STATUS,
        'gender': SortField.GENDER,
        // ... existing mappings ...
        'newMetric': SortField.NEW_METRIC, // Map your column key to the new SortField
      };
      return sortFieldMap[columnKey] || null;
    };
    ```
    *   Map the `key` from `dashboardConfig.ts` (e.g., `'newMetric'`) to the `SortField` enum member you just created (e.g., `SortField.NEW_METRIC`).

### c. Implement Sorting Logic in `sortStudents` if needed

1.  **Open:** `app/utils/sortHelpers.ts`
2.  **Locate:** The `sortStudents` function.
3.  **Add a new `case` for your `SortField`:**

    ```typescript
    // app/utils/sortHelpers.ts
    export const sortStudents = (
      students: StudentWithTestData[],
      sortField: SortField,
      sortDirection: SortDirection
    ): StudentWithTestData[] => {
      const sorted = [...students].sort((a, b) => {
        let valA: any;
        let valB: any;

        switch (sortField) {
          // ... existing cases ...
          case SortField.NEW_METRIC: // Use your new SortField
            valA = a.latestTest?.score?.newMetricValue || 0; // Provide a default if data can be undefined
            valB = b.latestTest?.score?.newMetricValue || 0;
            break;
          default:
            return 0;
        }

        // Apply ascending/descending logic
        if (typeof valA === 'string' && typeof valB === 'string') {
          return sortDirection === SortDirection.ASC ? valA.localeCompare(valB) : valB.localeCompare(valA);
        }
        return sortDirection === SortDirection.ASC ? valA - valB : valB - valA;
      });
      return sorted;
    };
    ```
    *   **`case SortField.NEW_METRIC`**: Use the `SortField` enum member you defined.
    *   **Access Data**: Get `valA` and `valB` from the `student` objects. Be mindful of potentially `undefined` values and provide a fallback (e.g., `|| 0` for numbers, `|| ''` for strings) to prevent errors during comparison.
    *   **Comparison Logic**: Use `localeCompare` for string comparisons and `valA - valB` for numerical comparisons.

---

## Step 5: (Optional) Update Data Fetching/Service

If the data for your new column needs to be fetched from a backend or requires specific processing, you might need to adjust the relevant service or repository files.

1.  **Identify relevant service/repository:**
    *   `app/service/homeService.ts` (for data aggregation/fetching)
    *   `app/repository/schoolStudentRepository.ts` or `app/repository/studentLatestTestRepository.ts` (for direct database interactions)
2.  **Modify as needed:** Ensure your data fetching logic retrieves the new field and makes it available in the `StudentWithTestData` structure.

---

## Important Notes:

*   **Consistency is Key**: Ensure that the `key` you define in `dashboardConfig.ts` is consistently used when referring to the column in `studentTable.tsx` and `sortHelpers.ts` (if sortable).
*   **Error Handling**: Consider how missing data for the new column should be handled (e.g., displaying `'-'` or `0`).
*   **Styling**: If your new column requires specific alignment or unique styles, you can add conditional classes in `studentTable.tsx` similar to how `paymentStatus` is aligned.
*   **Testing**: After adding a new column, thoroughly test its display, sorting (if applicable), and how it interacts with other features like filtering and pagination. 
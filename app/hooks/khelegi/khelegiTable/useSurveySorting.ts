"use client";

import { useState, useCallback, useMemo } from "react";
import { KhelegySurveyResponse } from "../../../models/khelegySurvey";

export type SurveySortField =
  | "name"
  | "ageGroup"
  | "schoolType"
  | "classGradeLevel"
  | "religion"
  | "sportsParticipationStatus"
  | "sportsFrequency"
  | "surveyCompletedAt";

export type SortDirection = "asc" | "desc";

interface UseSurveySortingResult {
  sortedSurveys: KhelegySurveyResponse[];
  handleSort: (field: SurveySortField) => void;
  getSortIconForField: (field: SurveySortField) => string;
  isSorting: boolean;
}

interface UseSurveySortingProps {
  surveys: KhelegySurveyResponse[];
}

type SortValue = string | number | Date | undefined;

const getSortValue = (
  survey: KhelegySurveyResponse,
  field: SurveySortField
): SortValue => {
  switch (field) {
    case "name":
      return survey.name.toLowerCase();
    case "ageGroup":
      return survey.ageGroup;
    case "schoolType":
      return survey.schoolType;
    case "classGradeLevel":
      return survey.classGradeLevel;
    case "religion":
      return survey.religion;
    case "sportsParticipationStatus":
      return survey.sportsParticipationStatus;
    case "sportsFrequency":
      return survey.sportsFrequency;
    case "surveyCompletedAt":
      return new Date(survey.surveyCompletedAt).getTime();
    default:
      return "";
  }
};

export const useSurveySorting = ({
  surveys,
}: UseSurveySortingProps): UseSurveySortingResult => {
  const [sortField, setSortField] = useState<SurveySortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [isSorting, setIsSorting] = useState<boolean>(false);

  // Sort surveys
  const sortedSurveys = useMemo(() => {
    if (!sortField) return surveys;

    setIsSorting(true);

    const sorted = [...surveys].sort((a, b) => {
      const aValue = getSortValue(a, sortField);
      const bValue = getSortValue(b, sortField);

      let comparison = 0;

      // Handle undefined values
      if (aValue === undefined && bValue === undefined) {
        comparison = 0;
      } else if (aValue === undefined) {
        comparison = 1; // undefined values go to the end
      } else if (bValue === undefined) {
        comparison = -1; // undefined values go to the end
      } else if (aValue < bValue) {
        comparison = -1;
      } else if (aValue > bValue) {
        comparison = 1;
      }

      const result = sortDirection === "desc" ? comparison * -1 : comparison;

      // Use setTimeout to update isSorting state after render
      setTimeout(() => setIsSorting(false), 0);

      return result;
    });

    return sorted;
  }, [surveys, sortField, sortDirection]);

  // Handle sort
  const handleSort = useCallback(
    (field: SurveySortField) => {
      if (sortField === field) {
        // Toggle direction if same field
        setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
      } else {
        // New field, start with ascending
        setSortField(field);
        setSortDirection("asc");
      }
    },
    [sortField]
  );

  // Get sort icon for field
  const getSortIconForField = useCallback(
    (field: SurveySortField): string => {
      if (sortField !== field) return "∣";
      return sortDirection === "asc" ? "▲" : "▼";
    },
    [sortField, sortDirection]
  );

  return {
    sortedSurveys,
    handleSort,
    getSortIconForField,
    isSorting,
  };
};

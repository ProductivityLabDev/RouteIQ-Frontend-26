import { apiClient } from "@/configs/api";
import { ApiResponse } from "@/types/api";

export interface Student {
  id: number;
  firstName: string;
  lastName: string;
  // ... add more fields
}

export interface CreateStudentPayload {
  firstName: string;
  lastName: string;
  pickupLocation: string;
  dropLocation: string;
  grade: string;
  emergencyContact: string;
  enrollmentNo: string;
  address: string;
  guardian1: string;
  guardian2: string;
  guardianEmail: string;
}

export const studentService = {
  getStudentsByInstitute: async (instituteId: number | string): Promise<ApiResponse<Student[]>> => {
    const response = await apiClient.get(`/institute/students-by-institute?instituteId=${instituteId}`);
    
    let studentsArray: Student[] = [];
    const resData = response.data;
    
    if (Array.isArray(resData)) {
      studentsArray = resData;
    } else if (resData && typeof resData === 'object') {
      if (resData.ok === true && Array.isArray(resData.data)) {
        studentsArray = resData.data;
      } else if (Array.isArray(resData.data)) {
        studentsArray = resData.data;
      } else if (resData.students && Array.isArray(resData.students)) {
        studentsArray = resData.students;
      }
    }
    
    return {
      ok: true,
      data: studentsArray,
    };
  },

  createStudent: async (instituteId: number | string, payload: CreateStudentPayload): Promise<any> => {
    const body = {
      firstName: payload.firstName || "",
      lastName: payload.lastName || "",
      grade: payload.grade || "",
      emergencyContact: payload.emergencyContact || "",
      enrollmentNo: payload.enrollmentNo || "",
      address: payload.address || "",
      guardian1: payload.guardian1 || "",
      guardian2: payload.guardian2 || "",
      guardianEmail: payload.guardianEmail || "",
      pickupLocation: payload.pickupLocation || "",
      dropLocation: payload.dropLocation || "",
    };
    const response = await apiClient.post(`/institute/${instituteId}/create-student`, body);
    // Backend already returns { ok, message, data: { studentId, smartMatch, ... } }
    return response.data;
  },
};

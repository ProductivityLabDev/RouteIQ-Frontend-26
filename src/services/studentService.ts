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
  busNo: string;
  instituteId: number;
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

  createStudent: async (payload: CreateStudentPayload): Promise<ApiResponse<any>> => {
    const response = await apiClient.post("/institute/create-student", payload);
    return {
      ok: true,
      data: response.data,
    };
  },
};


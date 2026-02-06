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
  pickupLatitude?: number | null;
  pickupLongitude?: number | null;
  dropLocation: string;
  dropLatitude?: number | null;
  dropLongitude?: number | null;
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

  createStudent: async (payload: CreateStudentPayload): Promise<any> => {
    const pickupLat = payload.pickupLatitude != null ? Number(payload.pickupLatitude) : null;
    const pickupLng = payload.pickupLongitude != null ? Number(payload.pickupLongitude) : null;
    const dropLat = payload.dropLatitude != null ? Number(payload.dropLatitude) : null;
    const dropLng = payload.dropLongitude != null ? Number(payload.dropLongitude) : null;

    // Send only keys that backend DTO allows (camelCase). Backend maps these to sp_Student @PickupLatitude, @DropLatitude, etc.
    const body = {
      ...payload,
      pickupLatitude: pickupLat,
      pickupLongitude: pickupLng,
      dropLatitude: dropLat,
      dropLongitude: dropLng,
    };
    const response = await apiClient.post("/institute/create-student", body);
    // Backend already returns { ok, message, data: { studentId, smartMatch, ... } }
    return response.data;
  },
};


import { create } from 'zustand';
import { studentAPI } from '../services/api';

const useStudentStore = create((set) => ({
  students: [],
  isLoading: false,
  error: null,

  // Fetch students
  fetchStudents: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await studentAPI.getMyStudents();
      set({
        students: response.data,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error.response?.data?.detail || 'Failed to fetch students',
        isLoading: false,
      });
    }
  },

  // Link student
  linkStudent: async (studentData) => {
    set({ isLoading: true, error: null });
    try {
      await studentAPI.linkStudent(studentData);
      // Refresh students list
      const response = await studentAPI.getMyStudents();
      set({
        students: response.data,
        isLoading: false,
      });
      return true;
    } catch (error) {
      set({
        error: error.response?.data?.detail || 'Failed to link student',
        isLoading: false,
      });
      return false;
    }
  },

  // Unlink student
  unlinkStudent: async (studentId) => {
    set({ isLoading: true, error: null });
    try {
      await studentAPI.unlinkStudent(studentId);
      // Refresh students list
      const response = await studentAPI.getMyStudents();
      set({
        students: response.data,
        isLoading: false,
      });
      return true;
    } catch (error) {
      set({
        error: error.response?.data?.detail || 'Failed to unlink student',
        isLoading: false,
      });
      return false;
    }
  },

  // Clear error
  clearError: () => set({ error: null }),
}));

export default useStudentStore;

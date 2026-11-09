// Modul 3: bentuk standar hasil pemanggilan API di aplikasi ini.
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

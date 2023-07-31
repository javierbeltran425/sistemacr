import { axiosPrivate } from "../api/axios";
import useAuth from "./useAuth";

const useRefreshToken = () => {
  const { setAuth } = useAuth();

  const refresh = async () => {
    const response = await axiosPrivate.get("/auth/refresh", {
      withCredentials: true,
    });
    setAuth((prev) => {
      const data = response.data;
      return {
        ...prev,
        id_usuario: data.id_usuario,
        email: data.email,
        nombre: data.nombre,
        rol: data.rol,
        activo: data.activo,
        accessToken: data.accessToken,
      };
    });
    return response.data.accessToken;
  };
  return refresh;
};

export default useRefreshToken;

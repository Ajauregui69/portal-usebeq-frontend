import { useState, useEffect } from 'react';
import Navbar from '../components/layout/Navbar';
import useAuthStore from '../store/authStore';

export default function Profile() {
  const { user } = useAuthStore();
  const [formData, setFormData] = useState({
    u_nombre: '',
    u_appat: '',
    u_apmat: '',
    u_tel: '',
    domicilio: '',
    sexo: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        u_nombre: user.u_nombre || '',
        u_appat: user.u_appat || '',
        u_apmat: user.u_apmat || '',
        u_tel: user.u_tel || '',
        domicilio: user.domicilio || '',
        sexo: user.sexo || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // TODO: Implement update profile
    alert('Funcionalidad en desarrollo');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Mi Perfil</h1>

        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Información de Cuenta</h2>
            <p className="text-gray-600">
              <span className="font-medium">Correo:</span> {user?.u_correo}
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Estado:</span>{' '}
              <span className="text-green-600">{user?.estatus}</span>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="u_nombre" className="block text-sm font-medium text-gray-700">
                  Nombre(s)
                </label>
                <input
                  type="text"
                  id="u_nombre"
                  name="u_nombre"
                  value={formData.u_nombre}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="u_appat" className="block text-sm font-medium text-gray-700">
                  Apellido Paterno
                </label>
                <input
                  type="text"
                  id="u_appat"
                  name="u_appat"
                  value={formData.u_appat}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="u_apmat" className="block text-sm font-medium text-gray-700">
                  Apellido Materno
                </label>
                <input
                  type="text"
                  id="u_apmat"
                  name="u_apmat"
                  value={formData.u_apmat}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="u_tel" className="block text-sm font-medium text-gray-700">
                  Teléfono
                </label>
                <input
                  type="tel"
                  id="u_tel"
                  name="u_tel"
                  value={formData.u_tel}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label htmlFor="domicilio" className="block text-sm font-medium text-gray-700">
                Domicilio
              </label>
              <input
                type="text"
                id="domicilio"
                name="domicilio"
                value={formData.domicilio}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="sexo" className="block text-sm font-medium text-gray-700">
                Sexo
              </label>
              <select
                id="sexo"
                name="sexo"
                value={formData.sexo}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Seleccionar</option>
                <option value="M">Masculino</option>
                <option value="F">Femenino</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium"
            >
              Guardar Cambios
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

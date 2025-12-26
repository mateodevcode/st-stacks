export function usuariosValidate(data, allUsers) {
  const errores = [];

  if (!data.name || data.name.trim() === "") {
    errores.push("Por favor, ingresa un nombre de perfil.");
  }

  if (data.name.length < 3) {
    errores.push("El nombre debe tener al menos 3 caracteres.");
  }

  if (!data.email || data.email.trim() === "") {
    errores.push("Por favor, ingresa un email.");
  }

  if (data.email && !/\S+@\S+\.\S+/.test(data.email)) {
    errores.push("El email ingresado no es válido.");
  }

  if (
    data.email &&
    allUsers.some(
      (u) =>
        u.email.toLowerCase() === data.email.toLowerCase() && u._id !== data._id // evita que choque con el mismo usuario
    )
  ) {
    errores.push("Ya existe un usuario con ese email.");
  }

  if (!data.telefono || data.telefono.trim() === "") {
    errores.push("Por favor, ingresa un número de teléfono.");
  }

  if (data.telefono && data.telefono.length < 8) {
    errores.push("El número de teléfono debe tener al menos 8 dígitos.");
  }

  return errores;
}

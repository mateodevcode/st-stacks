export function registrarseValidate(datos) {
  const errores = [];

  if (datos.name.trim() === "") {
    errores.push("Por favor, ingresa tu nombre.");
  }

  if (datos.email.trim() === "") {
    errores.push("Por favor, ingresa tu email.");
  }
  if (datos.email && !/\S+@\S+\.\S+/.test(datos.email)) {
    errores.push("Por favor, ingresa un email válido.");
  }

  if (!datos.password || datos.password.trim() === "") {
    errores.push("Por favor, ingresa una contraseña.");
  }

  if (datos.password.length < 12) {
    errores.push("La contraseña debe tener al menos 12 caracteres.");
  }

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{12,}$/;

  if (!datos.password || !passwordRegex.test(datos.password)) {
    errores.push(
      "La contraseña debe tener al menos 12 caracteres, incluir mayúsculas, minúsculas, números y un caracter especial."
    );
  }

  return errores;
}

document.addEventListener("DOMContentLoaded", () => {
  const skills = document.querySelector(".lista-conocimientos");

  // Limpiar alertas
  let alertas = document.querySelector(".alertas");
  if (alertas) {
    limpiarAlertas();
  }

  if (skills) {
    skills.addEventListener("click", agregarSkills);

    // Una vez que estamos en editar, llamar la función
    skillsSeleccionados();
  }
});

const skills = new Set();

const agregarSkills = (e) => {
  if (e.target.tagName === "LI") {
    if (e.target.classList.contains("activo")) {
      // Si el elemento ya está activo, quitarlo del Set y quitar la clase activo
      skills.delete(e.target.textContent);
      e.target.classList.remove("activo");
    } else {
      // Si el elemento no está activo, agregarlo al Set y agregar la clase activo
      skills.add(e.target.textContent);
      e.target.classList.toggle("activo");
    }
  }
  document.querySelector("#skills").value = [...skills];
};

const skillsSeleccionados = () => {
  const seleccionadas = Array.from(document.querySelectorAll(".lista-conocimientos .activo"));
  seleccionadas.forEach((seleccionada) => {
    skills.add(seleccionada.textContent);
  });

  document.querySelector("#skills").value = [...skills];
};

const limpiarAlertas = () => {
  const alertas = document.querySelector(".alertas");
  const interval = setInterval(() => {
    if (alertas.children.length > 0) {
      alertas.removeChild(alertas.children[0]);
    } else if (alertas.children.length === 0) {
      alertas.parentElement.removeChild(alertas);
      clearInterval(interval);
    }
  }, 2000);

}

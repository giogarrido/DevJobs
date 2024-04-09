import axios from "axios";
import Swal from "sweetalert2";

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
  const vacantesListado = document.querySelector(".panel-administracion");
  if (vacantesListado) {
    vacantesListado.addEventListener("click", accionesListado);
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

// Eliminar vacantes
const accionesListado = (e) => {
  e.preventDefault();

  if (e.target.dataset.eliminar) {
    // Eliminar por axios
    Swal.fire({
      title: "¿Confirmar eliminación?",
      text: "Una vez eliminada, no se puede recuperar",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, Eliminar",
      cancelButtonText: "No, Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        // Enviar petición a axios
        const url = `${location.origin}/vacantes/eliminar/${e.target.dataset.eliminar}`;

        // Axios para eliminar el registro
        axios.delete(url, { params: { url } }).then((respuesta) => {
          if (respuesta.status === 200) {
            Swal.fire("¡Eliminado!", respuesta.data, "success");

            // Eliminar del DOM
            e.target.parentElement.parentElement.parentElement.removeChild(e.target.parentElement.parentElement)
          }
        })
        .catch(() => {
          Swal.fire({
            icon: "error",
            title: "Hubo un error",
            text: "No se pudo eliminar",
          });
        });
      }
    });
  } else if (e.target.tagName === "A") {
    window.location.href = e.target.href;
  }
};

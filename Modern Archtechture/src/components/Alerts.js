import Swal from "sweetalert2";

const messages = {
  login: {
    title: "Login successful!",
    text: "Welcome back to Luxe Project Hub.",
    confirmButtonText: "Open dashboard",
  },
  logout: {
    title: "Logged out",
    text: "You have been safely logged out.",
    confirmButtonText: "Go to login",
  },
  signup: {
    title: "Account created!",
    text: "Your Luxe Modern Architecture account has been Successfully created",
    confirmButtonText: "Continue",
  },
};

export default function confirmAction(action) {
  const dark = document.body.classList.contains("dark-theme");
  return Swal.fire({
    ...messages[action],
    icon: "success",
    iconColor: "#d4a44b",
    customClass: {
      popup: "luxe-alert-popup",
      title: "luxe-alert-title",
      htmlContainer: "luxe-alert-message",
      confirmButton: "luxe-alert-confirm",
      footer: "luxe-alert-footer",
    },
    buttonsStyling: false,
    background: dark ? "#1e1c19" : "#ffffff",
    color: dark ? "#f3ede3" : "#222222",
    footer: "<span>LUXE STUDIO • Secure project access</span>",
    heightAuto: false,
    scrollbarPadding: false,
  });
}

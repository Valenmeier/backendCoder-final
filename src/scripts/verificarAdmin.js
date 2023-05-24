export let verificarAdmin = (req) => {

    let activateSession;
    let admin;
    if (req.user.user) {
      activateSession = true;
    } else {
      activateSession = false;
    }
    if (req.user.user.rol == "admin") {
      admin = true;
    } else {
      admin = false;
    }
    return {activateSession, admin};
};
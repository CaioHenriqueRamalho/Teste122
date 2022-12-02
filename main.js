const defaultUid = "00000000-0000-0000-0000-000000000000";

const mini = 'http://127.0.0.1:8000/api/mini/';
const auth = 'http://127.0.0.1:8000/api/';

axios.defaults.headers.common['Authorization'] = `Bearer ${sessionStorage.getItem("token")}`;

async function authUser() {
    if (sessionStorage.getItem("token") == null)
    {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("uid");

        document.getElementById("credentials1").classList.remove("hide");
        document.getElementById("credentials2").classList.remove("hide");
        document.getElementById("credentials3").classList.add("hide");
    }
    else
    {
        document.getElementById("credentials1").classList.add("hide");
        document.getElementById("credentials2").classList.add("hide")
        document.getElementById("credentials3").classList.remove("hide")
    }
}

function outputChange(newOutput) {
    let text = JSON.stringify(newOutput);

    document.getElementById("output").textContent = JSON.parse(text);
    return null;
}

function validateButton() {
    let input = document.getElementById("input").value;

    axios.post(
        mini,
        {
            "input": input,
            "uid": (sessionStorage.getItem("uid") == null) ? defaultUid : sessionStorage.getItem("uid")
        },
        {'Content-Type': 'application/json; charset=utf-8'}
    )
    .then(function (response) { outputChange(response.request.response); })
    .catch(function (error) { console.log(error); });
    
    return null;
}

function logButton() {
    let form = { uid: (sessionStorage.getItem("uid") == null) ? defaultUid : sessionStorage.getItem("uid"), };

    if (document.getElementById("start").value != "") { form.startDate = document.getElementById("start").value };

    if (document.getElementById("end").value != "") { form.startDate = document.getElementById("end").value };

    axios.get(
        mini,
        form
    )
    .then(function (response) { outputChange(response.request.response); })
    .catch(function (error) { console.log(error); });
}

function getCredentials() {
    let form = {};

    if (document.getElementById("email").value != "") { form.email = document.getElementById("email").value; };

    if (document.getElementById("password").value != "") { form.password = document.getElementById("password").value; };

    return form;
}

function registerButton() {
    let form = getCredentials();

    axios.post(
        auth+'register/',
        form,
        {'Content-Type': 'application/json; charset=utf-8'}
    )
    .then(function (response) {
        sessionStorage.setItem("token", SON.parse(response.request.response).authorisation.token);
        sessionStorage.setItem("uid", JSON.parse(response.request.response).user.uid);

        document.getElementById("credentials1").classList.add("hide");
        document.getElementById("credentials2").classList.add("hide");
        document.getElementById("credentials3").classList.remove("hide");
    })
    .catch(function (error) { console.log(error); });

    return null;
}

function loginButton() {
    let form = getCredentials();

    axios.post(
        auth+'login/',
        form,
        {'Content-Type': 'application/json; charset=utf-8'}
    )
    .then(function (response) {
        sessionStorage.setItem("token", JSON.parse(response.request.response).authorisation.token);
        sessionStorage.setItem("uid", JSON.parse(response.request.response).user.uid);

        document.getElementById("credentials1").classList.add("hide");
        document.getElementById("credentials2").classList.add("hide");
        document.getElementById("credentials3").classList.remove("hide");
    })
    .catch(function (error) { console.log(error); });

    return null;
}

async function logoutButton() {
    let token = sessionStorage.getItem("token");

    await fetch(auth+'logout/',
    {
        method: 'post',
        headers: {'Authentication': 'Bearer '+token, 'Accept': 'application/json', 'Content-Type': 'application/json'},
    })
    .then(function (response) {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("uid");

        document.getElementById("credentials1").classList.remove("hide");
        document.getElementById("credentials2").classList.remove("hide");
        document.getElementById("credentials3").classList.add("hide");
    })
    .catch(function (response) {console.log(response);});
}

// =========================================
// VELOCITY BIKES - MAIN SCRIPT
// =========================================

const API_URL = "http://127.0.0.1:5000";


// =========================================
// SEARCH BIKES
// =========================================

let search = document.getElementById("search");

if (search) {

    search.addEventListener("keyup", function () {

        let value =
            search.value.toLowerCase();

        let bikeCards =
            document.querySelectorAll(".bike-card");


        bikeCards.forEach(function (bike) {

            let title =
                bike.querySelector("h3");


            if (!title) {
                return;
            }


            let name =
                title.textContent.toLowerCase();


            if (name.includes(value)) {

                bike.style.display = "block";

            } else {

                bike.style.display = "none";

            }

        });

    });

}


// =========================================
// TEST RIDE BOOKING
// =========================================

let form =
    document.getElementById("testRideForm");


if (form) {

    form.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            let name =
                form.querySelector(
                    'input[type="text"]'
                ).value;


            let phone =
                form.querySelector(
                    'input[type="tel"]'
                ).value;


            let email =
                form.querySelector(
                    'input[type="email"]'
                ).value;


            let bike =
                form.querySelector(
                    "select"
                ).value;


            let date =
                form.querySelector(
                    'input[type="date"]'
                ).value;


            let booking = {

                name: name,

                phone: phone,

                email: email,

                bike: bike,

                date: date

            };


            try {

                let response =
                    await fetch(
                        API_URL + "/book",
                        {

                            method: "POST",

                            credentials: "include",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify(
                                    booking
                                )

                        }
                    );


                let result =
                    await response.json();


                if (response.ok) {

                    alert(
                        result.message ||
                        "Test ride booked successfully!"
                    );


                    form.reset();

                } else {

                    alert(
                        result.error ||
                        "Booking failed."
                    );

                }

            }

            catch (error) {

                console.error(
                    "Booking error:",
                    error
                );


                alert(
                    "Cannot connect to Flask server."
                );

            }

        }
    );

}


// =========================================
// IMAGE URL
// =========================================

function getImageURL(image) {

    if (!image) {

        return "";

    }


    // Already a complete URL

    if (
        image.startsWith("http://") ||
        image.startsWith("https://")
    ) {

        return image;

    }


    // Flask upload path

    return API_URL + image;

}


// =========================================
// BIKE IMAGE HTML
// =========================================

function getBikeImage(image, name) {

    let imageURL =
        getImageURL(image);


    if (!imageURL) {

        return `
            <div class="bike-placeholder">
                🏍️
            </div>
        `;

    }


    return `
        <div class="bike-image-container">

            <img
                src="${imageURL}"
                alt="${name}"
                class="bike-image"
                onerror="
                    this.style.display='none';
                    this.parentElement.innerHTML='🏍️';
                "
            >

        </div>
    `;

}


// =========================================
// LOAD BIKES PAGE
// =========================================

async function loadBikes() {

    let bikeList =
        document.getElementById(
            "bikeList"
        );


    if (!bikeList) {

        return;

    }


    try {

        let response =
            await fetch(
                API_URL + "/bikes"
            );


        let bikes =
            await response.json();


        bikeList.innerHTML =
            "";


        if (!bikes.length) {

            bikeList.innerHTML = `
                <p>
                    No bikes available.
                </p>
            `;

            return;

        }


        bikes.forEach(
            function (bike) {

                bikeList.innerHTML += `

                    <div class="bike-card">

                        ${getBikeImage(
                            bike.image,
                            bike.name
                        )}

                        <h3>
                            ${bike.name}
                        </h3>

                        <p class="price">
                            ₹${Number(
                                bike.price || 0
                            ).toLocaleString(
                                "en-IN"
                            )}
                        </p>

                        <p>
                            ${bike.engine || ""}
                        </p>

                        <p>
                            ${bike.mileage || ""}
                        </p>

                        <button
                            onclick="
                                viewBike('${bike._id}')
                            "
                        >
                            View Details
                        </button>

                    </div>

                `;

            }
        );


    }

    catch (error) {

        console.error(
            "Error loading bikes:",
            error
        );


        bikeList.innerHTML = `
            <p>
                Unable to load bikes.
            </p>
        `;

    }

}


// =========================================
// LOAD HOME PAGE BIKES
// =========================================

async function loadHomeBikes() {

    let bikeList =
        document.getElementById(
            "homeBikeList"
        );


    if (!bikeList) {

        return;

    }


    try {

        let response =
            await fetch(
                API_URL + "/bikes"
            );


        let bikes =
            await response.json();


        bikeList.innerHTML =
            "";


        bikes
            .slice(0, 3)
            .forEach(
                function (bike) {

                    bikeList.innerHTML += `

                        <div class="bike-card">

                            ${getBikeImage(
                                bike.image,
                                bike.name
                            )}

                            <h3>
                                ${bike.name}
                            </h3>

                            <p class="price">
                                ₹${Number(
                                    bike.price || 0
                                ).toLocaleString(
                                    "en-IN"
                                )}
                            </p>

                            <p>
                                ${bike.engine || ""}
                            </p>

                            <button
                                onclick="
                                    viewBike('${bike._id}')
                                "
                            >
                                View Details
                            </button>

                        </div>

                    `;

                }
            );


    }

    catch (error) {

        console.error(
            "Home bikes error:",
            error
        );

    }

}


// =========================================
// VIEW BIKE DETAILS
// =========================================

function viewBike(id) {

    if (!id) {

        alert(
            "Bike ID not found."
        );

        return;

    }


    window.location.href =
        "bike.html?id=" + id;

}


// =========================================
// RUN FUNCTIONS
// =========================================

loadBikes();

loadHomeBikes();
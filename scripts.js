document.addEventListener("DOMContentLoaded", () => {
    const filters = {
        category: "all",
        price: Infinity,
    };

    // Charger le fichier YAML
    fetch("config.yml")
        .then(response => response.text())
        .then(yamlText => {
            const config = jsyaml.load(yamlText); // Charger la configuration YAML
            console.log(config.settings); // Log pour vérifier le contenu chargé

            // Vérifier si les titres sont activés dans config.yml
            if (config.titles.enable_titles) {
                // Appliquer les titres dynamiquement
                document.querySelector("header h1").textContent = config.titles.header;
                document.querySelector(".illustrations h2").textContent = config.titles.illustrations;
                document.querySelector(".filters h2").textContent = config.titles.filters;
                document.querySelector(".components-list h2").textContent = config.titles.components;
            }

            // Appliquer les textes des bureaux et leurs images dynamiquement
            document.querySelectorAll(".illustration-item p")[0].textContent = config.example_desks.desk_1.text;
            document.querySelectorAll(".illustration-item p")[1].textContent = config.example_desks.desk_2.text;
            document.querySelectorAll(".illustration-item p")[2].textContent = config.example_desks.desk_3.text;

            document.querySelectorAll(".illustration-item img")[0].src = config.example_desks.desk_1.image_url;
            document.querySelectorAll(".illustration-item img")[1].src = config.example_desks.desk_2.image_url;
            document.querySelectorAll(".illustration-item img")[2].src = config.example_desks.desk_3.image_url;

            // Appliquer le thème et autres paramètres
            applyTheme(config.settings.theme_color, config.settings.mode);
            toggleSocialBar(config.settings.show_social_bar, config.social_links);
            populateComponents(config.components);

            // Activer/Désactiver la section des illustrations de bureau en fonction de config.yml
            if (config.enable_illustrations) {
                document.querySelector(".illustrations").style.display = "block";
            } else {
                document.querySelector(".illustrations").style.display = "none";
            }
        })
        .catch(error => {
            console.error("Erreur lors du chargement de la configuration :", error.message);
            document.querySelector(".components-list").innerHTML = `
                <p style="color: red;">Impossible de charger les composants. Vérifiez que le fichier <b>config.yml</b> est accessible.</p>`;
        });

    // Appliquer le thème du site
    function applyTheme(color, mode) {
        document.documentElement.style.setProperty("--accent-color", color);
        document.documentElement.style.setProperty("--link-color", color);
        document.documentElement.setAttribute("data-theme", mode); // Appliquer le mode (light ou dark)
    }

    // Activer/désactiver la barre des réseaux sociaux
    function toggleSocialBar(showSocialBar, socialLinks) {
        const socialBar = document.querySelector(".social-bar");
        if (showSocialBar) {
            socialBar.style.display = "flex";
            // Mettre à jour les liens des réseaux sociaux
            if (socialLinks) {
                document.getElementById("facebook").href = socialLinks.facebook || "#";
                document.getElementById("twitter").href = socialLinks.twitter || "#";
                document.getElementById("instagram").href = socialLinks.instagram || "#";
                document.getElementById("linkedin").href = socialLinks.linkedin || "#";
            }
        } else {
            socialBar.style.display = "none";
        }
    }

    // Générer les composants dynamiquement
    function populateComponents(components) {
        const componentsList = document.querySelector(".components-list");
        componentsList.innerHTML = ""; // Réinitialiser la liste
        components.forEach(component => {
            const imageUrl = component.image || "https://via.placeholder.com/150"; // Image par défaut
            const card = `
                <div class="component-card" data-category="${component.category}" data-price="${component.price}">
                    <img src="${imageUrl}" alt="${component.name}">
                    <h3>${component.name}</h3>
                    <p>${component.description}</p>
                    <p class="price">Prix : ${component.price} €</p>
                    <a href="${component.link}" target="_blank">Voir le produit</a>
                </div>`;
            componentsList.insertAdjacentHTML("beforeend", card);
        });
    }

    // Filtrer les composants
    document.getElementById("apply-filters").addEventListener("click", () => {
        filters.category = document.getElementById("category").value;
        filters.price = parseFloat(document.getElementById("price").value) || Infinity;
        filterComponents();
    });

    function filterComponents() {
        const components = document.querySelectorAll(".component-card");
        components.forEach(component => {
            const category = component.dataset.category;
            const price = parseFloat(component.dataset.price);
            const matchesCategory = filters.category === "all" || filters.category === category;
            const matchesPrice = price <= filters.price;

            if (matchesCategory && matchesPrice) {
                component.style.display = "block";
            } else {
                component.style.display = "none";
            }
        });
    }
});

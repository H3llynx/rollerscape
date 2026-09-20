export const layers = [
    {
        name: "Default",
        checked: true,
        attribution: "Tiles &copy; OpenStreetMap",
        url: "https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
    },
    {
        name: "Satellite",
        checked: false,
        attribution: "Tiles &copy; Esri",
        url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
    }
]
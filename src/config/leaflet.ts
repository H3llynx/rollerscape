export const layers = [
    {
        name: "Default",
        checked: true,
        attribution: "&copy; OpenStreetMap contributors &copy; CARTO",
        url: "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
    },
    {
        name: "Detailed",
        checked: false,
        attribution: "&copy; OpenStreetMap",
        url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    },
    {
        name: "Satellite",
        checked: false,
        attribution: "Tiles &copy; Esri",
        url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
    }
]
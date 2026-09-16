export const layers = [
    {
        name: "Default",
        checked: true,
        attribution: "&copy; OpenStreetMap contributors &copy; CARTO",
        url: "https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}{r}.png"
    },
    {
        name: "Satellite",
        checked: false,
        attribution: "Tiles &copy; Esri",
        url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
    }
]
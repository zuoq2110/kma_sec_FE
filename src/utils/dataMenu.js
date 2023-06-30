const MONITOR_SERVICE_URL = process.env.REACT_APP_MONITOR_SERVICE_URL;

export const dataMenusAuth = [{
        label: "Dashboard",
        items: [{
            label: "Analyze",
            icon: "pi pi-chart-bar",
            to: "/analyze/",
        }, ],
    },
    {
        label: "Manage",
        items: [{
                label: "Statistics",
                icon: "pi pi-fw pi-chart-line",
                to: "/statistics/",
            },
            {
                label: "Models",
                icon: "pi pi-fw pi-tags",
                to: "/models/",
            },
            {
                label: "Monitor",
                icon: "pi pi-fw pi-desktop",
                to: MONITOR_SERVICE_URL,
            },
        ],
    },
];

export const dataMenus = [{
    label: "Dashboard",
    items: [{
        label: "Analyze",
        icon: "pi pi-chart-bar",
        to: "/analyze/",
    }, ],
}, ];

export const dataAccount = {
    dataUsername: "admin",
    dataPassword: "admin@actvn",
};
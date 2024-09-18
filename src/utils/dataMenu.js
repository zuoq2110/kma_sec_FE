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
                items: [{
                        label: "APK",
                        icon: "pi pi-fw pi-android",
                        to: "/statistics/APK",
                    },
                    {
                        label: "PE",
                        icon: "pi pi-fw pi-desktop",
                        to: "/statistics/PE",
                    },
                ],
            },
            {
                label: "Models",
                icon: "pi pi-fw pi-tags",
                items: [{
                        label: "APK",
                        icon: "pi pi-fw pi-android",
                        to: "/models/APK",
                    },
                    {
                        label: "PE",
                        icon: "pi pi-fw pi-desktop",
                        to: "/models/PE",
                    },
                ],
            },
            {
                label: "Monitor",
                icon: "pi pi-fw pi-desktop",
                to: MONITOR_SERVICE_URL,
            },
            {
                label: "Visualization",
                icon: "pi pi-fw pi-desktop",
                items: [{
                    label: "APK",
                    icon: "pi pi-fw pi-android",
                    to: "/visualization/APK",
                },
                {
                    label: "PE",
                    icon: "pi pi-fw pi-desktop",
                    to: "/visualization/PE",
                },
            ],
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
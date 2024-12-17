import { Typography } from '@mui/material';
import { useQuery } from 'react-query';
import Box from '@mui/material/Box';
import { PowerBIEmbed } from 'powerbi-client-react';
import { models } from 'powerbi-client';
import React from 'react';

export default function EligibilityDashboardBi() {

    const getAccessToken = async () => {
        const url = `${import.meta.env.VITE_MMS_PUBLIC_API_URL ?? ''}/api/power-bi/access-token/${import.meta.env.VITE_POWER_BI_WORKSPACE_ID}/${import.meta.env.VITE_POWER_BI_REPORT_ID}`;

        const response = await fetch(url);

        const data = await response.json();

        return data;
    };

    const { data } = useQuery({
        queryKey: [
            'power-bi',
            'access-token',
            import.meta.env.VITE_POWER_BI_WORKSPACE_ID,
            import.meta.env.VITE_POWER_BI_REPORT_ID,
        ],
        queryFn: getAccessToken,
    });

    if (!data) return null;

    return (
        <Box height={"100%"}>
            <Box
                sx={{
                    backgroundColor: '#ededed',
                    p: 2,
                    display: 'flex',
                    justifyContent: 'space-between',
                    paddingRight: 5,
                    alignItems: 'center',
                }}
            >
                <Typography variant="h4" sx={{ ml: 3 }}>
                    BI
                </Typography>
            </Box>
            <React.Suspense>
                <PowerBIEmbed
                    embedConfig={{
                        type: "report", // Supported types: report, dashboard, tile, visual, qna, paginated report and create
                        id: data.embedUrl[0].reportId,
                        embedUrl: data.embedUrl[0].embedUrl,
                        accessToken: data.accessToken,
                        tokenType: models.TokenType.Embed, // Use models.TokenType.Aad for SaaS embed
                        settings: {
                            panes: {
                                filters: {
                                    expanded: false,
                                    visible: false,
                                },
                            },
                            background: models.BackgroundType.Transparent,
                        },
                    }}
                    eventHandlers={
                        new Map([
                            [
                                "loaded",
                                function () {
                                    console.log("Report loaded");
                                },
                            ],
                            [
                                "rendered",
                                function () {
                                    console.log("Report rendered");
                                },
                            ],
                            [
                                "error",
                                function (event) {
                                    console.log(event?.detail);
                                },
                            ],
                            ["visualClicked", () => console.log("visual clicked")],
                            ["pageChanged", (event) => console.log(event)],
                        ])
                    }
                    cssClassName="reportClass"
                    getEmbeddedComponent={(embeddedReport) => {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        (window).report = embeddedReport;
                    }}
                />
            </React.Suspense>
        </Box>
    );
}

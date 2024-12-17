import React from "react";

import { Box, Card, Typography, CardContent } from "@mui/material";

export const _mobileAppSnapshotImageHeight = "18.1875rem";
export const _loginBannerCardHeight = "13.5rem";

const LoginBanner = () => (
    <Card
      elevation={0}
      sx={{
        height: _loginBannerCardHeight,
        borderRadius: "1.25rem",
        background:
          "linear-gradient(180deg, #102F47 0%, rgba(47, 27, 27, 0.00) 100%)",
        marginTop: `calc(${_mobileAppSnapshotImageHeight} - ${_loginBannerCardHeight})`,
        overflow: "hidden",
        position: "relative",
      }}
    >
      <CardContent
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        <Box zIndex={1}>
          <Typography variant="h6" color="white">
            Your Next-Gen Practice Experience
          </Typography>
          <Typography variant="h6" color="white">
            now in your hands
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexGrow: 1,
          }}
        >
          <img
            alt="App Store Buttons"
            src="/images/login/app-store-buttons.png"
            style={{
              width: "14.9375rem",
              height: "2.3125rem",
            }}
          />
        </Box>
      </CardContent>

      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          right: 0,
        }}
      >
        <img
          alt="Mobile App Snapshot"
          src="/images/login/mobile-app-snapshot.png"
          style={{
            width: "17.0625rem",
            height: _mobileAppSnapshotImageHeight,
          }}
        />
      </Box>
    </Card>
  );

export default LoginBanner;

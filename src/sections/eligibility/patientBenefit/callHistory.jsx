import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Divider, List, ListItem, ListItemText, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Scrollbar from 'src/components/scrollbar';
import { usePatientCallListQuery } from 'src/framework/rest/eligibility/eligibility.query';
import CallSentiment from 'src/sections/lead-management/detailsPage/callSentiment';


const CallHistory = ({ mobile }) => {
    const theme = useTheme();
    const navigate = useNavigate();
    const { data, isLoading } = usePatientCallListQuery({ Phone: mobile, PatientId : "" });
    // const [isPlaying, setIsPlaying] = useState(false);
    const [audioUrl, setAudioUrl] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const audioRef = useRef(null);

    const handleOpenModal = (url) => {
        setAudioUrl(url);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        // setIsPlaying(false);
        setIsModalOpen(false);
        setAudioUrl('');
    };

    const handleAnalysisNavigation = (call) => {
        navigate(`/lead_management/callAnalysis/${call?.CallSid}/${call?.Phone}`)
    }

    return (
        <>
            <List sx={{ height: 1750 }}>
                {isLoading ? <CircularProgress /> :
                <Scrollbar>
                    {data?.callHistory?.length === 0 ? (
                        <Typography variant="body1">No call history available.</Typography>
                    ) : (
                        data?.callHistory?.map((call, index) => (
                            <Box key={index} className="text-base flex flex-row gap-5 whitespace-nowrap">
                                <Box className="relative">
                                    <Box className="mb-4 pr-4 h-[100%] border-r" />
                                    <Typography className="bg-white absolute top-5 right-[-5px] p-1 w-3 h-3 border-[2px] rounded-lg" sx={{ borderColor: theme.palette.primary.main }} />
                                </Box>

                                <Box className="w-full">
                                    <ListItem alignItems="flex-start">
                                        <ListItemText
                                            primary={
                                                <Box display='flex' justifyContent='space-between'>
                                                    <Typography>{call?.Phone}</Typography>
                                                    <Typography>{call?.duration} Sec</Typography>
                                                </Box>
                                            }
                                            secondary={
                                                <Box>
                                                    <Typography>{call?.callType}</Typography>
                                                    {call?.azureBlobUrl && (
                                                        <>
                                                            <Box display="flex" justifyContent="space-between">
                                                                <Button
                                                                    variant="text"
                                                                    color="primary"
                                                                    onClick={() => handleOpenModal(call.azureBlobUrl)}
                                                                    startIcon={<PlayArrowIcon />}
                                                                >
                                                                    Play Voice
                                                                </Button>
                                                                {/* <WordDocument data={call}/> */}
                                                                <Button variant='text' onClick={() => handleAnalysisNavigation(call)}>
                                                                    Post Call Analytics
                                                                </Button>
                                                            </Box>
                                                            <CallSentiment call={call} />

                                                        </>
                                                    )}
                                                </Box>
                                            }
                                        />
                                    </ListItem>
                                    <Divider />
                                </Box>
                            </Box>
                        ))
                    )}
                </Scrollbar>}
            </List>

            <Dialog open={isModalOpen} onClose={handleCloseModal}>
                <DialogTitle>Audio Playback</DialogTitle>
                <DialogContent>
                    <audio ref={audioRef} src={audioUrl} controls />
                </DialogContent>
                <DialogActions>
                    {/* <Button onClick={handlePlayPause} startIcon={isPlaying ? <PauseIcon /> : <PlayArrowIcon />}>
                        {isPlaying ? 'Pause' : 'Play'}
                    </Button> */}
                    <Button onClick={handleCloseModal} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default CallHistory;

import { useEffect, useState, useRef } from 'react';
import {
  Box,
  CssBaseline,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Alert,
  Snackbar,
  CircularProgress,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  People as PeopleIcon,
  CalendarMonth as CalendarIcon,
  BarChart as BarChartIcon,
  Settings as SettingsIcon,
  Add as AddIcon,
  ChevronLeft as ChevronLeftIcon,
  ExitToApp as ExitToAppIcon,
  VideoLibrary as VideoLibraryIcon,
  CardGiftcard as CardGiftcardIcon,
  RecordVoiceOver as RecordVoiceOverIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';

import {
  logout,
  getAllEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  getAllClubs,
  createClub,
  updateClub,
  deleteClub,
  getAllWorkshops,
  createWorkshop,
  updateWorkshop,
  deleteWorkshop,
  getAllVideos,
  createVideo,
  updateVideo,
  deleteVideo,
  getAllExperienceCards,
  createExperienceCard,
  updateExperienceCard,
  deleteExperienceCard,
  getAllExperienceSessions,
  createExperienceSession,
  updateExperienceSession,
  deleteExperienceSession,
  uploadToCloudinary,
} from '../services/api';
import { useNavigate } from 'react-router-dom';

const drawerWidth = 280;

const CATEGORIES = [
  'football', 'basketball', 'volleyball', 'chess', 'arts', 'music',
  'theatre', 'coding', 'gaming', 'education', 'volunteering', 'culture',
  'tech', 'health', 'entrepreneurship', 'design', 'marketing', 'other'
];

export default function AdminNew() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // UI State
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopOpen, setDesktopOpen] = useState(true);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  // Data State
  const [events, setEvents] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [workshops, setWorkshops] = useState([]);
  const [videos, setVideos] = useState([]);
  const [experienceCards, setExperienceCards] = useState([]);
  const [experienceSessions, setExperienceSessions] = useState([]);

  // Dialog State
  const [eventDialog, setEventDialog] = useState({ open: false, mode: 'create', data: null });
  const [clubDialog, setClubDialog] = useState({ open: false, mode: 'create', data: null });
  const [workshopDialog, setWorkshopDialog] = useState({ open: false, mode: 'create', data: null });
  const [videoDialog, setVideoDialog] = useState({ open: false, mode: 'create', data: null });
  const [cardDialog, setCardDialog] = useState({ open: false, mode: 'create', data: null });
  const [sessionDialog, setSessionDialog] = useState({ open: false, mode: 'create', data: null });

  // Refs
  const dashboardRef = useRef<HTMLDivElement>(null);
  const eventsRef = useRef<HTMLDivElement>(null);
  const clubsRef = useRef<HTMLDivElement>(null);
  const workshopsRef = useRef<HTMLDivElement>(null);
  const videosRef = useRef<HTMLDivElement>(null);
  const experienceCardsRef = useRef<HTMLDivElement>(null);
  const experienceSessionsRef = useRef<HTMLDivElement>(null);

  // Menu Items
  const menuItems = [
    { text: 'Mon Tableau de Bord', icon: <HomeIcon />, section: 'dashboard', ref: dashboardRef },
    { text: 'Gestion des Événements', icon: <CalendarIcon />, section: 'events', ref: eventsRef },
    { text: 'Gestion des Clubs', icon: <PeopleIcon />, section: 'clubs', ref: clubsRef },
    { text: 'Gestion des Workshops', icon: <SettingsIcon />, section: 'workshops', ref: workshopsRef },
    { text: 'École Virtuelle (Vidéos)', icon: <VideoLibraryIcon />, section: 'videos', ref: videosRef },
    { text: 'Cartes d\'Expérience', icon: <CardGiftcardIcon />, section: 'experienceCards', ref: experienceCardsRef },
    { text: 'Sessions d\'Expérience', icon: <RecordVoiceOverIcon />, section: 'experienceSessions', ref: experienceSessionsRef },
  ];

  // Fetch all data on mount
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [eventsData, clubsData, workshopsData, videosData, cardsData, sessionsData] = await Promise.all([
        getAllEvents(),
        getAllClubs(),
        getAllWorkshops(),
        getAllVideos(),
        getAllExperienceCards(),
        getAllExperienceSessions(),
      ]);

      setEvents(eventsData || []);
      setClubs(clubsData || []);
      setWorkshops(workshopsData || []);
      setVideos(videosData || []);
      setExperienceCards(cardsData || []);
      setExperienceSessions(sessionsData || []);
    } catch (error) {
      showSnackbar('Erreur lors du chargement des données', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message: string, severity: 'success' | 'error' = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleDrawerToggle = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen);
    } else {
      setDesktopOpen(!desktopOpen);
    }
  };

  const scrollToSection = (section: string, ref: any) => {
    setActiveSection(section);
    if (isMobile) setMobileOpen(false);
    setTimeout(() => {
      ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  // ==================== EVENT HANDLERS ====================
  const handleEventSubmit = async (formData: any) => {
    try {
      if (eventDialog.mode === 'create') {
        await createEvent(formData);
        showSnackbar('Événement créé avec succès');
      } else {
        await updateEvent(eventDialog.data._id, formData);
        showSnackbar('Événement mis à jour avec succès');
      }
      setEventDialog({ open: false, mode: 'create', data: null });
      fetchAllData();
    } catch (error) {
      showSnackbar('Erreur lors de l\'enregistrement', 'error');
    }
  };

  const handleEventDelete = async (id: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet événement?')) return;
    try {
      await deleteEvent(id);
      showSnackbar('Événement supprimé avec succès');
      fetchAllData();
    } catch (error) {
      showSnackbar('Erreur lors de la suppression', 'error');
    }
  };

  // ==================== CLUB HANDLERS ====================
  const handleClubSubmit = async (formData: any) => {
    try {
      if (clubDialog.mode === 'create') {
        await createClub(formData);
        showSnackbar('Club créé avec succès');
      } else {
        await updateClub(clubDialog.data._id, formData);
        showSnackbar('Club mis à jour avec succès');
      }
      setClubDialog({ open: false, mode: 'create', data: null });
      fetchAllData();
    } catch (error) {
      showSnackbar('Erreur lors de l\'enregistrement', 'error');
    }
  };

  const handleClubDelete = async (id: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce club?')) return;
    try {
      await deleteClub(id);
      showSnackbar('Club supprimé avec succès');
      fetchAllData();
    } catch (error) {
      showSnackbar('Erreur lors de la suppression', 'error');
    }
  };

  // ==================== WORKSHOP HANDLERS ====================
  const handleWorkshopSubmit = async (formData: any) => {
    try {
      if (workshopDialog.mode === 'create') {
        await createWorkshop(formData);
        showSnackbar('Workshop créé avec succès');
      } else {
        await updateWorkshop(workshopDialog.data._id, formData);
        showSnackbar('Workshop mis à jour avec succès');
      }
      setWorkshopDialog({ open: false, mode: 'create', data: null });
      fetchAllData();
    } catch (error) {
      showSnackbar('Erreur lors de l\'enregistrement', 'error');
    }
  };

  const handleWorkshopDelete = async (id: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce workshop?')) return;
    try {
      await deleteWorkshop(id);
      showSnackbar('Workshop supprimé avec succès');
      fetchAllData();
    } catch (error) {
      showSnackbar('Erreur lors de la suppression', 'error');
    }
  };

  // ==================== VIDEO HANDLERS ====================
  const handleVideoSubmit = async (formData: any) => {
    try {
      if (videoDialog.mode === 'create') {
        await createVideo(formData);
        showSnackbar('Vidéo créée avec succès');
      } else {
        await updateVideo(videoDialog.data._id, formData);
        showSnackbar('Vidéo mise à jour avec succès');
      }
      setVideoDialog({ open: false, mode: 'create', data: null });
      fetchAllData();
    } catch (error) {
      showSnackbar('Erreur lors de l\'enregistrement', 'error');
    }
  };

  const handleVideoDelete = async (id: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette vidéo?')) return;
    try {
      await deleteVideo(id);
      showSnackbar('Vidéo supprimée avec succès');
      fetchAllData();
    } catch (error) {
      showSnackbar('Erreur lors de la suppression', 'error');
    }
  };

  // ==================== EXPERIENCE CARD HANDLERS ====================
  const handleCardSubmit = async (formData: any) => {
    try {
      if (cardDialog.mode === 'create') {
        await createExperienceCard(formData);
        showSnackbar('Carte créée avec succès');
      } else {
        await updateExperienceCard(cardDialog.data._id, formData);
        showSnackbar('Carte mise à jour avec succès');
      }
      setCardDialog({ open: false, mode: 'create', data: null });
      fetchAllData();
    } catch (error) {
      showSnackbar('Erreur lors de l\'enregistrement', 'error');
    }
  };

  const handleCardDelete = async (id: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette carte?')) return;
    try {
      await deleteExperienceCard(id);
      showSnackbar('Carte supprimée avec succès');
      fetchAllData();
    } catch (error) {
      showSnackbar('Erreur lors de la suppression', 'error');
    }
  };

  // ==================== EXPERIENCE SESSION HANDLERS ====================
  const handleSessionSubmit = async (formData: any) => {
    try {
      if (sessionDialog.mode === 'create') {
        await createExperienceSession(formData);
        showSnackbar('Session créée avec succès');
      } else {
        await updateExperienceSession(sessionDialog.data._id, formData);
        showSnackbar('Session mise à jour avec succès');
      }
      setSessionDialog({ open: false, mode: 'create', data: null });
      fetchAllData();
    } catch (error) {
      showSnackbar('Erreur lors de l\'enregistrement', 'error');
    }
  };

  const handleSessionDelete = async (id: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette session?')) return;
    try {
      await deleteExperienceSession(id);
      showSnackbar('Session supprimée avec succès');
      fetchAllData();
    } catch (error) {
      showSnackbar('Erreur lors de la suppression', 'error');
    }
  };

  // ==================== DRAWER ====================
  const drawer = (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#FAFAFA' }}>
      <Toolbar sx={{ borderBottom: '1px solid #E0E0E0', justifyContent: 'space-between', py: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#2C3E50', fontSize: 16 }}>
          Admin Centre Jeunesse
        </Typography>
        {!isMobile && (
          <IconButton onClick={handleDrawerToggle} size="small">
            <ChevronLeftIcon />
          </IconButton>
        )}
      </Toolbar>

      <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
        <List sx={{ px: 2, pt: 2 }}>
          {menuItems.map((item, index) => (
            <ListItem
              key={index}
              onClick={() => scrollToSection(item.section, item.ref)}
              sx={{
                borderRadius: 2,
                mb: 1,
                bgcolor: activeSection === item.section ? '#95D6C2' : 'transparent',
                color: activeSection === item.section ? '#fff' : '#2C3E50',
                '&:hover': {
                  bgcolor: activeSection === item.section ? '#7bc4b0' : '#F1FDF0',
                },
                transition: 'all 0.3s ease',
                cursor: 'pointer',
              }}
            >
              <ListItemIcon
                sx={{
                  color: activeSection === item.section ? '#fff' : '#95D6C2',
                  minWidth: 40,
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{
                  fontSize: 14,
                  fontWeight: activeSection === item.section ? 600 : 500,
                }}
              />
            </ListItem>
          ))}
        </List>
      </Box>

      <Box sx={{ p: 2, borderTop: '1px solid #E0E0E0' }}>
        <Button
          fullWidth
          variant="outlined"
          startIcon={<ExitToAppIcon />}
          onClick={handleLogout}
          sx={{
            color: '#e74c3c',
            borderColor: '#e74c3c',
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600,
            py: 1.5,
            '&:hover': {
              borderColor: '#c0392b',
              bgcolor: '#fee',
            },
          }}
        >
          Se Déconnecter
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      
      {/* AppBar */}
      <AppBar
        position="fixed"
        sx={{
          width: { sm: desktopOpen ? `calc(100% - ${drawerWidth}px)` : '100%' },
          ml: { sm: desktopOpen ? `${drawerWidth}px` : 0 },
          bgcolor: '#fff',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          transition: 'all 0.3s ease',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, color: '#2C3E50' }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1, color: '#2C3E50', fontWeight: 700 }}>
            Tableau de Bord - Centre Admin
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Drawer */}
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        {isMobile ? (
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{ keepMounted: true }}
            sx={{
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
            }}
          >
            {drawer}
          </Drawer>
        ) : (
          <Drawer
            variant={desktopOpen ? 'persistent' : 'temporary'}
            open={desktopOpen}
            sx={{
              '& .MuiDrawer-paper': {
                boxSizing: 'border-box',
                width: drawerWidth,
                transition: 'all 0.3s ease',
              },
            }}
          >
            {drawer}
          </Drawer>
        )}
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${desktopOpen ? drawerWidth : 0}px)` },
          mt: 8,
          transition: 'all 0.3s ease',
          bgcolor: '#f5f7fa',
          minHeight: '100vh',
        }}
      >
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {/* Dashboard Section */}
            <Box ref={dashboardRef} mb={4}>
              <Typography variant="h4" sx={{ mb: 3, fontWeight: 700, color: '#2C3E50' }}>
                Bienvenue, Admin!
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 3 }}>
                <Card>
                  <CardContent>
                    <Typography color="textSecondary">Événements</Typography>
                    <Typography variant="h3">{events.length}</Typography>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent>
                    <Typography color="textSecondary">Clubs</Typography>
                    <Typography variant="h3">{clubs.length}</Typography>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent>
                    <Typography color="textSecondary">Workshops</Typography>
                    <Typography variant="h3">{workshops.length}</Typography>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent>
                    <Typography color="textSecondary">Vidéos</Typography>
                    <Typography variant="h3">{videos.length}</Typography>
                  </CardContent>
                </Card>
              </Box>
            </Box>

            {/* Events Section */}
            <EventsSection
              ref={eventsRef}
              events={events}
              onAdd={() => setEventDialog({ open: true, mode: 'create', data: null })}
              onEdit={(event) => setEventDialog({ open: true, mode: 'edit', data: event })}
              onDelete={handleEventDelete}
            />

            {/* Clubs Section */}
            <ClubsSection
              ref={clubsRef}
              clubs={clubs}
              onAdd={() => setClubDialog({ open: true, mode: 'create', data: null })}
              onEdit={(club) => setClubDialog({ open: true, mode: 'edit', data: club })}
              onDelete={handleClubDelete}
            />

            {/* Workshops Section */}
            <WorkshopsSection
              ref={workshopsRef}
              workshops={workshops}
              onAdd={() => setWorkshopDialog({ open: true, mode: 'create', data: null })}
              onEdit={(workshop) => setWorkshopDialog({ open: true, mode: 'edit', data: workshop })}
              onDelete={handleWorkshopDelete}
            />

            {/* Videos Section */}
            <VideosSection
              ref={videosRef}
              videos={videos}
              onAdd={() => setVideoDialog({ open: true, mode: 'create', data: null })}
              onEdit={(video) => setVideoDialog({ open: true, mode: 'edit', data: video })}
              onDelete={handleVideoDelete}
            />

            {/* Experience Cards Section */}
            <ExperienceCardsSection
              ref={experienceCardsRef}
              cards={experienceCards}
              onAdd={() => setCardDialog({ open: true, mode: 'create', data: null })}
              onEdit={(card) => setCardDialog({ open: true, mode: 'edit', data: card })}
              onDelete={handleCardDelete}
            />

            {/* Experience Sessions Section */}
            <ExperienceSessionsSection
              ref={experienceSessionsRef}
              sessions={experienceSessions}
              onAdd={() => setSessionDialog({ open: true, mode: 'create', data: null })}
              onEdit={(session) => setSessionDialog({ open: true, mode: 'edit', data: session })}
              onDelete={handleSessionDelete}
            />
          </>
        )}
      </Box>

      {/* Dialogs */}
      <EventDialog
        open={eventDialog.open}
        mode={eventDialog.mode}
        data={eventDialog.data}
        onClose={() => setEventDialog({ open: false, mode: 'create', data: null })}
        onSubmit={handleEventSubmit}
      />

      <ClubDialog
        open={clubDialog.open}
        mode={clubDialog.mode}
        data={clubDialog.data}
        onClose={() => setClubDialog({ open: false, mode: 'create', data: null })}
        onSubmit={handleClubSubmit}
      />

      <WorkshopDialog
        open={workshopDialog.open}
        mode={workshopDialog.mode}
        data={workshopDialog.data}
        onClose={() => setWorkshopDialog({ open: false, mode: 'create', data: null })}
        onSubmit={handleWorkshopSubmit}
      />

      <VideoDialog
        open={videoDialog.open}
        mode={videoDialog.mode}
        data={videoDialog.data}
        onClose={() => setVideoDialog({ open: false, mode: 'create', data: null })}
        onSubmit={handleVideoSubmit}
      />

      <ExperienceCardDialog
        open={cardDialog.open}
        mode={cardDialog.mode}
        data={cardDialog.data}
        onClose={() => setCardDialog({ open: false, mode: 'create', data: null })}
        onSubmit={handleCardSubmit}
      />

      <ExperienceSessionDialog
        open={sessionDialog.open}
        mode={sessionDialog.mode}
        data={sessionDialog.data}
        onClose={() => setSessionDialog({ open: false, mode: 'create', data: null })}
        onSubmit={handleSessionSubmit}
      />

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

// SECTION COMPONENTS TO BE CONTINUED IN NEXT MESSAGE...

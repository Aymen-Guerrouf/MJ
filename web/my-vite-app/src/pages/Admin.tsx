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
  Grid,
  Avatar,
  Chip,
  useTheme,
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  People as PeopleIcon,
  CalendarMonth as CalendarIcon,
  BarChart as BarChartIcon,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  Add as AddIcon,
  ChevronLeft as ChevronLeftIcon,
  ExitToApp as ExitToAppIcon,
  VideoLibrary as VideoLibraryIcon,
  CardGiftcard as CardGiftcardIcon,
  RecordVoiceOver as RecordVoiceOverIcon
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from 'recharts';

import {
  AdminDashboard,
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
} from '../services/api.js'
import { useNavigate } from 'react-router-dom';

// Type definitions
interface Event {
  _id: string;
  title: string;
  date: string;
  location: string;
  registrations?: any[];
  [key: string]: any;
}

interface Club {
  _id: string;
  name: string;
  description?: string;
  members?: any[];
  [key: string]: any;
}

interface Workshop {
  _id: string;
  title: string;
  date: string;
  mentor?: string;
  enrollments?: any[];
  [key: string]: any;
}

interface Video {
  _id: string;
  title: string;
  category?: string;
  duration?: string;
  views?: number;
  [key: string]: any;
}

interface ExperienceCard {
  _id: string;
  title: string;
  author?: { name: string };
  tag?: string;
  createdAt: string;
  [key: string]: any;
}

interface ExperienceSession {
  _id: string;
  title: string;
  date: string;
  time?: string;
  author?: { name: string };
  participants?: any[];
  [key: string]: any;
}

const drawerWidth = 280;

export default function Admin() {
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopOpen, setDesktopOpen] = useState(true);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [adminData , setAdminData] = useState(null)
  
  // Real data states
  const [events, setEvents] = useState<Event[]>([]);
  const [clubs, setClubs] = useState<Club[]>([]);
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [experienceCards, setExperienceCards] = useState<ExperienceCard[]>([]);
  const [experienceSessions, setExperienceSessions] = useState<ExperienceSession[]>([]);
  
  // Loading states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Dialog states
  const [eventDialogOpen, setEventDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    category: '',
    maxParticipants: '',
  });
  
  const [clubDialogOpen, setClubDialogOpen] = useState(false);
  const [editingClub, setEditingClub] = useState<Club | null>(null);
  const [clubForm, setClubForm] = useState({
    name: '',
    description: '',
    category: '',
    meetingSchedule: '',
  });
  
  const [workshopDialogOpen, setWorkshopDialogOpen] = useState(false);
  const [editingWorkshop, setEditingWorkshop] = useState<Workshop | null>(null);
  const [workshopForm, setWorkshopForm] = useState({
    title: '',
    description: '',
    date: '',
    mentor: '',
    duration: '',
    price: '',
    maxParticipants: '',
    category: '',
  });
  
  const [videoDialogOpen, setVideoDialogOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);
  const [videoForm, setVideoForm] = useState({
    title: '',
    description: '',
    url: '',
    category: '',
    duration: '',
  });
  
  const [cardDialogOpen, setCardDialogOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<ExperienceCard | null>(null);
  const [cardForm, setCardForm] = useState({
    title: '',
    summary: '',
    lessons: '',
    tag: '',
  });
  
  const [sessionDialogOpen, setSessionDialogOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<ExperienceSession | null>(null);
  const [sessionForm, setSessionForm] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    tag: '',
  });
  
  // Snackbar state
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  useEffect(()=>{
    const fetchData = async()=>{
      try {
        const data = await AdminDashboard()
        setAdminData(data)
      } catch (err: any) {
        console.error('Admin dashboard error:', err);
        if (err.response?.status === 401) {
          // User is not authenticated, redirect to login
          setSnackbar({ open: true, message: 'Session expirée. Veuillez vous reconnecter.', severity: 'error' });
          setTimeout(() => navigate('/'), 2000);
        }
      }
    }
    fetchData()
  },[navigate])
  
  // Fetch all data on component mount
  useEffect(() => {
    fetchAllData();
  }, []);
  
  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [eventsData, clubsData, workshopsData, videosData, cardsData, sessionsData] = await Promise.all([
        getAllEvents().catch(err => { console.error('Events error:', err); return []; }),
        getAllClubs().catch(err => { console.error('Clubs error:', err); return []; }),
        getAllWorkshops().catch(err => { console.error('Workshops error:', err); return []; }),
        getAllVideos().catch(err => { console.error('Videos error:', err); return []; }),
        getAllExperienceCards().catch(err => { console.error('Cards error:', err); return []; }),
        getAllExperienceSessions().catch(err => { console.error('Sessions error:', err); return []; }),
      ]);
      
      setEvents(Array.isArray(eventsData) ? eventsData : []);
      setClubs(Array.isArray(clubsData) ? clubsData : []);
      setWorkshops(Array.isArray(workshopsData) ? workshopsData : []);
      setVideos(Array.isArray(videosData) ? videosData : []);
      setExperienceCards(Array.isArray(cardsData) ? cardsData : []);
      setExperienceSessions(Array.isArray(sessionsData) ? sessionsData : []);
      setError(null);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };
  console.log(adminData);
  
  async function handlelogout(){
    await logout()
    navigate('/')
  }
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Refs for scrolling to sections
  const dashboardRef = useRef<HTMLDivElement>(null);
  const inscriptionsRef = useRef<HTMLDivElement>(null);
  const eventsRef = useRef<HTMLDivElement>(null);
  const clubsRef = useRef<HTMLDivElement>(null);
  const workshopsRef = useRef<HTMLDivElement>(null);
  const videosRef = useRef<HTMLDivElement>(null);
  const experienceCardsRef = useRef<HTMLDivElement>(null);
  const experienceSessionsRef = useRef<HTMLDivElement>(null);
  const analyticsRef = useRef<HTMLDivElement>(null);

  const handleDrawerToggle = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen);
    } else {
      setDesktopOpen(!desktopOpen);
    }
  };

  const scrollToSection = (section: string, ref: React.RefObject<HTMLDivElement>) => {
    setActiveSection(section);
    if (isMobile) {
      setMobileOpen(false);
    }
    setTimeout(() => {
      ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const directorRegistrationData = [
    { month: 'Jan', value: 100 },
    { month: 'Fév', value: 108 },
    { month: 'Mar', value: 118 },
    { month: 'Avr', value: 128 },
    { month: 'Mai', value: 135 },
    { month: 'Juin', value: 145 },
    { month: 'Juil', value: 152 },
    { month: 'Août', value: 148 },
    { month: 'Sep', value: 155 },
    { month: 'Oct', value: 160 },
    { month: 'Nov', value: 163 },
    { month: 'Déc', value: 165 },
  ];

  const clubDistributionData = [
    { name: 'Club Musique', value: 25, color: '#4AB0E6' },
    { name: 'Club Théâtre', value: 15, color: '#A855F7' },
    { name: 'Club Sport', value: 30, color: '#10B981' },
    { name: 'Club Lecture', value: 10, color: '#F59E0B' },
  ];

  const eventParticipationBarData = [
    { name: 'Atelier Codage', value: 30 },
    { name: 'Séance Ciné', value: 50 },
    { name: 'Tournoi E-sport', value: 70 },
    { name: 'Journées PO', value: 20 },
    { name: 'Cours Cuisine', value: 45 },
  ];

  // Delete handlers
  const handleDeleteEvent = async (id: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet événement?')) return;
    try {
      await deleteEvent(id);
      setEvents(events.filter(e => e._id !== id));
    } catch (err) {
      console.error('Error deleting event:', err);
      alert('Erreur lors de la suppression');
    }
  };

  const handleDeleteClub = async (id: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce club?')) return;
    try {
      await deleteClub(id);
      setClubs(clubs.filter(c => c._id !== id));
    } catch (err) {
      console.error('Error deleting club:', err);
      alert('Erreur lors de la suppression');
    }
  };

  const handleDeleteWorkshop = async (id: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet atelier?')) return;
    try {
      await deleteWorkshop(id);
      setWorkshops(workshops.filter(w => w._id !== id));
    } catch (err) {
      console.error('Error deleting workshop:', err);
      alert('Erreur lors de la suppression');
    }
  };

  const handleDeleteVideo = async (id: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette vidéo?')) return;
    try {
      await deleteVideo(id);
      setVideos(videos.filter(v => v._id !== id));
    } catch (err) {
      console.error('Error deleting video:', err);
      alert('Erreur lors de la suppression');
    }
  };

  const handleDeleteExperienceCard = async (id: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette carte?')) return;
    try {
      await deleteExperienceCard(id);
      setExperienceCards(experienceCards.filter(c => c._id !== id));
    } catch (err) {
      console.error('Error deleting card:', err);
      alert('Erreur lors de la suppression');
    }
  };

  const handleDeleteExperienceSession = async (id: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette session?')) return;
    try {
      await deleteExperienceSession(id);
      setExperienceSessions(experienceSessions.filter(s => s._id !== id));
    } catch (err) {
      console.error('Error deleting session:', err);
      alert('Erreur lors de la suppression');
    }
  };
  
  // Event CRUD handlers
  const handleOpenEventDialog = (event?: Event) => {
    if (event) {
      setEditingEvent(event);
      setEventForm({
        title: event.title,
        description: event.description || '',
        date: event.date?.split('T')[0] || '',
        location: event.location,
        category: event.category || '',
        maxParticipants: event.maxParticipants?.toString() || '',
      });
    } else {
      setEditingEvent(null);
      setEventForm({
        title: '',
        description: '',
        date: '',
        location: '',
        category: '',
        maxParticipants: '',
      });
    }
    setEventDialogOpen(true);
  };
  
  const handleCloseEventDialog = () => {
    setEventDialogOpen(false);
    setEditingEvent(null);
    setEventForm({
      title: '',
      description: '',
      date: '',
      location: '',
      category: '',
      maxParticipants: '',
    });
  };
  
  const handleSaveEvent = async () => {
    try {
      const eventData = {
        ...eventForm,
        maxParticipants: eventForm.maxParticipants ? parseInt(eventForm.maxParticipants) : undefined,
      };
      
      if (editingEvent) {
        const updated = await updateEvent(editingEvent._id, eventData);
        setEvents(events.map(e => e._id === editingEvent._id ? updated : e));
        setSnackbar({ open: true, message: 'Événement mis à jour avec succès', severity: 'success' });
      } else {
        const newEvent = await createEvent(eventData);
        setEvents([...events, newEvent]);
        setSnackbar({ open: true, message: 'Événement créé avec succès', severity: 'success' });
      }
      handleCloseEventDialog();
    } catch (err: any) {
      console.error('Error saving event:', err);
      setSnackbar({ open: true, message: err.response?.data?.message || 'Erreur lors de la sauvegarde', severity: 'error' });
    }
  };
  
  // Club CRUD handlers
  const handleOpenClubDialog = (club?: Club) => {
    if (club) {
      setEditingClub(club);
      setClubForm({
        name: club.name,
        description: club.description || '',
        category: club.category || '',
        meetingSchedule: club.meetingSchedule || '',
      });
    } else {
      setEditingClub(null);
      setClubForm({
        name: '',
        description: '',
        category: '',
        meetingSchedule: '',
      });
    }
    setClubDialogOpen(true);
  };
  
  const handleCloseClubDialog = () => {
    setClubDialogOpen(false);
    setEditingClub(null);
    setClubForm({
      name: '',
      description: '',
      category: '',
      meetingSchedule: '',
    });
  };
  
  const handleSaveClub = async () => {
    try {
      if (editingClub) {
        const updated = await updateClub(editingClub._id, clubForm);
        setClubs(clubs.map(c => c._id === editingClub._id ? updated : c));
        setSnackbar({ open: true, message: 'Club mis à jour avec succès', severity: 'success' });
      } else {
        const newClub = await createClub(clubForm);
        setClubs([...clubs, newClub]);
        setSnackbar({ open: true, message: 'Club créé avec succès', severity: 'success' });
      }
      handleCloseClubDialog();
    } catch (err: any) {
      console.error('Error saving club:', err);
      setSnackbar({ open: true, message: err.response?.data?.message || 'Erreur lors de la sauvegarde', severity: 'error' });
    }
  };
  
  // Workshop CRUD handlers
  const handleOpenWorkshopDialog = (workshop?: Workshop) => {
    if (workshop) {
      setEditingWorkshop(workshop);
      setWorkshopForm({
        title: workshop.title,
        description: workshop.description || '',
        date: workshop.date?.split('T')[0] || '',
        mentor: workshop.mentor || '',
        duration: workshop.duration?.toString() || '',
        price: workshop.price?.toString() || '',
        maxParticipants: workshop.maxParticipants?.toString() || '',
        category: workshop.category || '',
      });
    } else {
      setEditingWorkshop(null);
      setWorkshopForm({ title: '', description: '', date: '', mentor: '', duration: '', price: '', maxParticipants: '', category: '' });
    }
    setWorkshopDialogOpen(true);
  };
  
  const handleSaveWorkshop = async () => {
    try {
      const workshopData = {
        ...workshopForm,
        duration: workshopForm.duration ? parseInt(workshopForm.duration) : undefined,
        price: workshopForm.price ? parseFloat(workshopForm.price) : undefined,
        maxParticipants: workshopForm.maxParticipants ? parseInt(workshopForm.maxParticipants) : undefined,
      };
      
      if (editingWorkshop) {
        const updated = await updateWorkshop(editingWorkshop._id, workshopData);
        setWorkshops(workshops.map(w => w._id === editingWorkshop._id ? updated : w));
        setSnackbar({ open: true, message: 'Atelier mis à jour', severity: 'success' });
      } else {
        const newWorkshop = await createWorkshop(workshopData);
        setWorkshops([...workshops, newWorkshop]);
        setSnackbar({ open: true, message: 'Atelier créé', severity: 'success' });
      }
      setWorkshopDialogOpen(false);
    } catch (err: any) {
      setSnackbar({ open: true, message: err.response?.data?.message || 'Erreur', severity: 'error' });
    }
  };
  
  // Video CRUD handlers
  const handleOpenVideoDialog = (video?: Video) => {
    if (video) {
      setEditingVideo(video);
      setVideoForm({
        title: video.title,
        description: video.description || '',
        url: video.url || '',
        category: video.category || '',
        duration: video.duration || '',
      });
    } else {
      setEditingVideo(null);
      setVideoForm({ title: '', description: '', url: '', category: '', duration: '' });
    }
    setVideoDialogOpen(true);
  };
  
  const handleSaveVideo = async () => {
    try {
      if (editingVideo) {
        const updated = await updateVideo(editingVideo._id, videoForm);
        setVideos(videos.map(v => v._id === editingVideo._id ? updated : v));
        setSnackbar({ open: true, message: 'Vidéo mise à jour', severity: 'success' });
      } else {
        const newVideo = await createVideo(videoForm);
        setVideos([...videos, newVideo]);
        setSnackbar({ open: true, message: 'Vidéo créée', severity: 'success' });
      }
      setVideoDialogOpen(false);
    } catch (err: any) {
      setSnackbar({ open: true, message: err.response?.data?.message || 'Erreur', severity: 'error' });
    }
  };
  
  // Experience Card CRUD handlers
  const handleOpenCardDialog = (card?: ExperienceCard) => {
    if (card) {
      setEditingCard(card);
      setCardForm({
        title: card.title,
        summary: card.summary || '',
        lessons: card.lessons || '',
        tag: card.tag || '',
      });
    } else {
      setEditingCard(null);
      setCardForm({ title: '', summary: '', lessons: '', tag: '' });
    }
    setCardDialogOpen(true);
  };
  
  const handleSaveCard = async () => {
    try {
      if (editingCard) {
        const updated = await updateExperienceCard(editingCard._id, cardForm);
        setExperienceCards(experienceCards.map(c => c._id === editingCard._id ? updated : c));
        setSnackbar({ open: true, message: 'Carte mise à jour', severity: 'success' });
      } else {
        const newCard = await createExperienceCard(cardForm);
        setExperienceCards([...experienceCards, newCard]);
        setSnackbar({ open: true, message: 'Carte créée', severity: 'success' });
      }
      setCardDialogOpen(false);
    } catch (err: any) {
      setSnackbar({ open: true, message: err.response?.data?.message || 'Erreur', severity: 'error' });
    }
  };
  
  // Experience Session CRUD handlers
  const handleOpenSessionDialog = (session?: ExperienceSession) => {
    if (session) {
      setEditingSession(session);
      setSessionForm({
        title: session.title,
        description: session.description || '',
        date: session.date?.split('T')[0] || '',
        time: session.time || '',
        tag: session.tag || '',
      });
    } else {
      setEditingSession(null);
      setSessionForm({ title: '', description: '', date: '', time: '', tag: '' });
    }
    setSessionDialogOpen(true);
  };
  
  const handleSaveSession = async () => {
    try {
      if (editingSession) {
        const updated = await updateExperienceSession(editingSession._id, sessionForm);
        setExperienceSessions(experienceSessions.map(s => s._id === editingSession._id ? updated : s));
        setSnackbar({ open: true, message: 'Session mise à jour', severity: 'success' });
      } else {
        const newSession = await createExperienceSession(sessionForm);
        setExperienceSessions([...experienceSessions, newSession]);
        setSnackbar({ open: true, message: 'Session créée', severity: 'success' });
      }
      setSessionDialogOpen(false);
    } catch (err: any) {
      setSnackbar({ open: true, message: err.response?.data?.message || 'Erreur', severity: 'error' });
    }
  };

  const menuItems = [
    { text: 'Mon Tableau de Bord', icon: <HomeIcon />, section: 'dashboard', ref: dashboardRef },
    { text: 'Inscriptions des Jeunes', icon: <PeopleIcon />, section: 'inscriptions', ref: inscriptionsRef },
    { text: 'Gestion des Événements', icon: <CalendarIcon />, section: 'events', ref: eventsRef },
    { text: 'Gestion des Clubs', icon: <PeopleIcon />, section: 'clubs', ref: clubsRef },
    { text: 'Gestion des Workshops', icon: <SettingsIcon />, section: 'workshops', ref: workshopsRef },
    { text: 'École Virtuelle (Vidéos)', icon: <VideoLibraryIcon />, section: 'videos', ref: videosRef },
    { text: 'Cartes d\'Expérience', icon: <CardGiftcardIcon />, section: 'experienceCards', ref: experienceCardsRef },
    { text: 'Sessions d\'Expérience', icon: <RecordVoiceOverIcon />, section: 'experienceSessions', ref: experienceSessionsRef },
    { text: 'Analyses', icon: <BarChartIcon />, section: 'analytics', ref: analyticsRef },
  ];

 const drawer = (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#FAFAFA' }}>
      <Toolbar
        sx={{
          borderBottom: '1px solid #E0E0E0',
          justifyContent: 'space-between',
          py: 2,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#2C3E50', fontSize: 16 }}>
          Admin Centre Jeunesse
        </Typography>
        {!isMobile && (
          <IconButton onClick={handleDrawerToggle} size="small">
            <ChevronLeftIcon />
          </IconButton>
        )}
      </Toolbar>
      
      {/* Menu Items - Takes available space */}
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
      
      {/* Logout Button - Stays at bottom */}
      <Box sx={{ p: 2, borderTop: '1px solid #E0E0E0' }}>
        <Button
          fullWidth
          variant="outlined"
          startIcon={<ExitToAppIcon />}
          onClick={() => {
            handlelogout()
          }}
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

  const StatCard = ({ title, value, icon, color }: any) => (
    <Card 
      elevation={0}
      sx={{ 
        height: '100%',
        background: 'linear-gradient(135deg, #fff 0%, #f8f9fa 100%)',
        border: '1px solid #E0E0E0',
        borderRadius: 3,
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          transform: 'translateY(-2px)',
        }
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <Box 
            sx={{ 
              bgcolor: `${color}15`,
              p: 1.5,
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {icon}
          </Box>
        </Box>
        <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.5, fontSize: 11, fontWeight: 500 }}>
          {title}
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 700, mt: 1, color: '#2C3E50' }}>
          {value}
        </Typography>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#F5F7FA' }}>
      <CssBaseline />
      
      {/* AppBar */}
      <AppBar 
        position="fixed" 
        elevation={0}
        sx={{ 
          zIndex: (theme) => theme.zIndex.drawer + 1,
          bgcolor: '#fff',
          borderBottom: '1px solid #E0E0E0',
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
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, color: '#2C3E50', fontWeight: 600 }}>
            Tableau de Bord du Directeur
          </Typography>
          <IconButton sx={{ color: '#95D6C2', mr: 1 }}>
            <NotificationsIcon />
          </IconButton>
          <Avatar sx={{ bgcolor: '#95D6C2', width: 36, height: 36, fontSize: 14 }}>FZ</Avatar>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Box component="nav">
        {/* Mobile Drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box' },
          }}
        >
          {drawer}
        </Drawer>
        
        {/* Desktop Drawer - Permanent */}
        {/* Desktop Drawer - Permanent */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            width: desktopOpen ? drawerWidth : 0,
            flexShrink: 0,
            '& .MuiDrawer-paper': { 
              width: desktopOpen ? drawerWidth : 0,
              boxSizing: 'border-box',
              border: 'none',
              boxShadow: desktopOpen ? '2px 0 8px rgba(0,0,0,0.05)' : 'none',
              transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
              overflowX: 'hidden',
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          p: { xs: 2, sm: 3, md: 4 },
          mt: 8,
          width: { 
            xs: '100%', 
            md: desktopOpen ? `calc(100% - ${drawerWidth}px)` : '100%' 
          },
          ml: { md: desktopOpen ? `${drawerWidth}px` : 0 },
          transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }}
      >
        {/* Dashboard Stats Section */}
        <Box ref={dashboardRef} mb={4}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 700, color: '#2C3E50' }}>
            Aperçu Global
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} lg={3}>
              <StatCard
                title="Jeunes Inscrits"
                value="150"
                icon={<PeopleIcon sx={{ fontSize: 28, color: '#95D6C2' }} />}
                color="#95D6C2"
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <StatCard
                title="Événements Actifs"
                value="25"
                icon={<CalendarIcon sx={{ fontSize: 28, color: '#F59E0B' }} />}
                color="#F59E0B"
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <StatCard
                title="Clubs du Centre"
                value="5"
                icon={<HomeIcon sx={{ fontSize: 28, color: '#4AB0E6' }} />}
                color="#4AB0E6"
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <StatCard
                title="Membres de Clubs"
                value="80"
                icon={<PeopleIcon sx={{ fontSize: 28, color: '#A855F7' }} />}
                color="#A855F7"
              />
            </Grid>
          </Grid>
        </Box>

        {/* Analytics Section */}
        <Box ref={analyticsRef} mb={4}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 700, color: '#2C3E50' }}>
            Analyses et Statistiques
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={6}>
              <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid #E0E0E0', height: '100%' }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                    Évolution des Inscriptions
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Tendances mensuelles pour votre centre
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={directorRegistrationData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Line type="monotone" dataKey="value" stroke="#95D6C2" strokeWidth={3} dot={{ fill: '#95D6C2', r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} lg={6}>
              <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid #E0E0E0', height: '100%' }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                    Répartition par Club
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Distribution des membres
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie 
                        data={clubDistributionData} 
                        dataKey="value" 
                        cx="50%" 
                        cy="50%" 
                        outerRadius={90}
                      >
                        {clubDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <Box display="flex" flexWrap="wrap" gap={1} mt={2} justifyContent="center">
                    {clubDistributionData.map((item, index) => (
                      <Chip 
                        key={index}
                        label={item.name}
                        size="small"
                        sx={{ 
                          bgcolor: `${item.color}20`,
                          color: item.color,
                          fontWeight: 500,
                          fontSize: 11
                        }}
                      />
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Card elevation={0} sx={{ mt: 3, borderRadius: 3, border: '1px solid #E0E0E0' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                Participation aux Événements
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Nombre de participants par événement
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={eventParticipationBarData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" angle={-20} textAnchor="end" interval={0} height={80} tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#F59E0B" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Box>

        {/* Inscriptions Section */}
        <Box ref={inscriptionsRef} mb={4}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 700, color: '#2C3E50' }}>
            Inscriptions des Jeunes
          </Typography>
          <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid #E0E0E0' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="body1" color="text.secondary">
                Section des inscriptions - Contenu à venir
              </Typography>
            </CardContent>
          </Card>
        </Box>

        {/* Events Section */}
        <Box ref={eventsRef} mb={4}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 700, color: '#2C3E50' }}>
            Gestion des Événements
          </Typography>
          <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid #E0E0E0' }}>
            <CardContent sx={{ p: 3 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} flexWrap="wrap" gap={2}>
                <Typography variant="body2" color="text.secondary">
                  Affichez et gérez les événements de votre centre
                </Typography>
                <Button 
                  variant="contained" 
                  startIcon={<AddIcon />}
                  onClick={() => handleOpenEventDialog()}
                  sx={{
                    bgcolor: '#95D6C2',
                    '&:hover': { bgcolor: '#7bc4b0' },
                    textTransform: 'none',
                    borderRadius: 2,
                    px: 3
                  }}
                >
                  Nouvel Événement
                </Button>
              </Box>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: '#F8F9FA' }}>
                      <TableCell sx={{ fontWeight: 600, fontSize: 12, textTransform: 'uppercase' }}>Nom</TableCell>
                      <TableCell sx={{ fontWeight: 600, fontSize: 12, textTransform: 'uppercase' }}>Date</TableCell>
                      <TableCell sx={{ fontWeight: 600, fontSize: 12, textTransform: 'uppercase', display: { xs: 'none', md: 'table-cell' } }}>Lieu</TableCell>
                      <TableCell sx={{ fontWeight: 600, fontSize: 12, textTransform: 'uppercase' }}>Participants</TableCell>
                      <TableCell sx={{ fontWeight: 600, fontSize: 12, textTransform: 'uppercase' }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={5} align="center">Chargement...</TableCell>
                      </TableRow>
                    ) : events.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} align="center">Aucun événement</TableCell>
                      </TableRow>
                    ) : (
                      events.map((event) => (
                        <TableRow key={event._id} hover>
                          <TableCell>{event.title}</TableCell>
                          <TableCell>{new Date(event.date).toLocaleDateString('fr-FR')}</TableCell>
                          <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>{event.location}</TableCell>
                          <TableCell>{event.registrations?.length || 0}</TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <Button 
                                variant="outlined" 
                                size="small"
                                onClick={() => handleOpenEventDialog(event)}
                                sx={{
                                  color: '#95D6C2',
                                  borderColor: '#95D6C2',
                                  '&:hover': {
                                    borderColor: '#7bc4b0',
                                    bgcolor: '#F1FDF0'
                                  },
                                  textTransform: 'none',
                                  fontSize: 12
                                }}
                              >
                                Modifier
                              </Button>
                              <Button 
                                variant="outlined" 
                                size="small"
                                onClick={() => handleDeleteEvent(event._id)}
                                sx={{
                                  color: '#e74c3c',
                                  borderColor: '#e74c3c',
                                  '&:hover': {
                                    borderColor: '#c0392b',
                                    bgcolor: '#fee'
                                  },
                                  textTransform: 'none',
                                  fontSize: 12
                                }}
                              >
                                Supprimer
                              </Button>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Box>

        {/* Clubs Section */}
        <Box ref={clubsRef}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 700, color: '#2C3E50' }}>
            Gestion des Clubs
          </Typography>
          <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid #E0E0E0' }}>
            <CardContent sx={{ p: 3 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} flexWrap="wrap" gap={2}>
                <Typography variant="body2" color="text.secondary">
                  Gérez les clubs de votre maison de jeunes
                </Typography>
                <Button 
                  variant="contained" 
                  startIcon={<AddIcon />}
                  onClick={() => handleOpenClubDialog()}
                  sx={{
                    bgcolor: '#95D6C2',
                    '&:hover': { bgcolor: '#7bc4b0' },
                    textTransform: 'none',
                    borderRadius: 2,
                    px: 3
                  }}
                >
                  Nouveau Club
                </Button>
              </Box>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: '#F8F9FA' }}>
                      <TableCell sx={{ fontWeight: 600, fontSize: 12, textTransform: 'uppercase' }}>Nom du Club</TableCell>
                      <TableCell sx={{ fontWeight: 600, fontSize: 12, textTransform: 'uppercase', display: { xs: 'none', md: 'table-cell' } }}>Activité</TableCell>
                      <TableCell sx={{ fontWeight: 600, fontSize: 12, textTransform: 'uppercase' }}>Membres</TableCell>
                      <TableCell sx={{ fontWeight: 600, fontSize: 12, textTransform: 'uppercase' }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={4} align="center">Chargement...</TableCell>
                      </TableRow>
                    ) : clubs.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} align="center">Aucun club</TableCell>
                      </TableRow>
                    ) : (
                      clubs.map((club) => (
                        <TableRow key={club._id} hover>
                          <TableCell>{club.name}</TableCell>
                          <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>{club.description || 'N/A'}</TableCell>
                          <TableCell>{club.members?.length || 0}</TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <Button 
                                variant="outlined" 
                                size="small"
                                onClick={() => handleOpenClubDialog(club)}
                                sx={{
                                  color: '#95D6C2',
                                  borderColor: '#95D6C2',
                                  '&:hover': {
                                    borderColor: '#7bc4b0',
                                    bgcolor: '#F1FDF0'
                                  },
                                  textTransform: 'none',
                                  fontSize: 12
                                }}
                              >
                                Modifier
                              </Button>
                              <Button 
                                variant="outlined" 
                                size="small"
                                onClick={() => handleDeleteClub(club._id)}
                                sx={{
                                  color: '#e74c3c',
                                  borderColor: '#e74c3c',
                                  '&:hover': {
                                    borderColor: '#c0392b',
                                    bgcolor: '#fee'
                                  },
                                  textTransform: 'none',
                                  fontSize: 12
                                }}
                              >
                                Supprimer
                              </Button>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Box>

        {/* Workshops Section */}
        <Box ref={workshopsRef} mt={4}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 700, color: '#2C3E50' }}>
            Gestion des Workshops
          </Typography>
          <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid #E0E0E0' }}>
            <CardContent sx={{ p: 3 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} flexWrap="wrap" gap={2}>
                <Typography variant="body2" color="text.secondary">
                  Gérez les ateliers et formations de votre centre
                </Typography>
                <Button 
                  variant="contained" 
                  startIcon={<AddIcon />}
                  onClick={() => handleOpenWorkshopDialog()}
                  sx={{
                    bgcolor: '#95D6C2',
                    '&:hover': { bgcolor: '#7bc4b0' },
                    textTransform: 'none',
                    borderRadius: 2,
                    px: 3
                  }}
                >
                  Nouveau Workshop
                </Button>
              </Box>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: '#F8F9FA' }}>
                      <TableCell sx={{ fontWeight: 600, fontSize: 12, textTransform: 'uppercase' }}>Nom</TableCell>
                      <TableCell sx={{ fontWeight: 600, fontSize: 12, textTransform: 'uppercase' }}>Date</TableCell>
                      <TableCell sx={{ fontWeight: 600, fontSize: 12, textTransform: 'uppercase', display: { xs: 'none', md: 'table-cell' } }}>Mentor</TableCell>
                      <TableCell sx={{ fontWeight: 600, fontSize: 12, textTransform: 'uppercase' }}>Participants</TableCell>
                      <TableCell sx={{ fontWeight: 600, fontSize: 12, textTransform: 'uppercase' }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={5} align="center">Chargement...</TableCell>
                      </TableRow>
                    ) : workshops.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} align="center">Aucun atelier</TableCell>
                      </TableRow>
                    ) : (
                      workshops.map((workshop) => (
                        <TableRow key={workshop._id} hover>
                          <TableCell>{workshop.title}</TableCell>
                          <TableCell>{new Date(workshop.date).toLocaleDateString('fr-FR')}</TableCell>
                          <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>{workshop.mentor || 'N/A'}</TableCell>
                          <TableCell>{workshop.enrollments?.length || 0}</TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <Button 
                                variant="outlined" 
                                size="small"
                                onClick={() => handleOpenWorkshopDialog(workshop)}
                                sx={{
                                  color: '#95D6C2',
                                  borderColor: '#95D6C2',
                                  '&:hover': {
                                    borderColor: '#7bc4b0',
                                    bgcolor: '#F1FDF0'
                                  },
                                  textTransform: 'none',
                                  fontSize: 12
                                }}
                              >
                                Modifier
                              </Button>
                              <Button 
                                variant="outlined" 
                                size="small"
                                onClick={() => handleDeleteWorkshop(workshop._id)}
                                sx={{
                                  color: '#e74c3c',
                                  borderColor: '#e74c3c',
                                  '&:hover': {
                                    borderColor: '#c0392b',
                                    bgcolor: '#fee'
                                  },
                                  textTransform: 'none',
                                  fontSize: 12
                                }}
                              >
                                Supprimer
                              </Button>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Box>

        {/* Virtual School Videos Section */}
        <Box ref={videosRef} mt={4}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 700, color: '#2C3E50' }}>
            École Virtuelle - Gestion des Vidéos
          </Typography>
          <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid #E0E0E0' }}>
            <CardContent sx={{ p: 3 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} flexWrap="wrap" gap={2}>
                <Typography variant="body2" color="text.secondary">
                  Téléchargez et gérez les vidéos éducatives
                </Typography>
                <Button 
                  variant="contained" 
                  startIcon={<AddIcon />}
                  onClick={() => handleOpenVideoDialog()}
                  sx={{
                    bgcolor: '#95D6C2',
                    '&:hover': { bgcolor: '#7bc4b0' },
                    textTransform: 'none',
                    borderRadius: 2,
                    px: 3
                  }}
                >
                  Nouvelle Vidéo
                </Button>
              </Box>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: '#F8F9FA' }}>
                      <TableCell sx={{ fontWeight: 600, fontSize: 12, textTransform: 'uppercase' }}>Titre</TableCell>
                      <TableCell sx={{ fontWeight: 600, fontSize: 12, textTransform: 'uppercase', display: { xs: 'none', md: 'table-cell' } }}>Catégorie</TableCell>
                      <TableCell sx={{ fontWeight: 600, fontSize: 12, textTransform: 'uppercase' }}>Durée</TableCell>
                      <TableCell sx={{ fontWeight: 600, fontSize: 12, textTransform: 'uppercase' }}>Vues</TableCell>
                      <TableCell sx={{ fontWeight: 600, fontSize: 12, textTransform: 'uppercase' }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={5} align="center">Chargement...</TableCell>
                      </TableRow>
                    ) : videos.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} align="center">Aucune vidéo</TableCell>
                      </TableRow>
                    ) : (
                      videos.map((video) => (
                        <TableRow key={video._id} hover>
                          <TableCell>{video.title}</TableCell>
                          <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                            <Chip label={video.category || 'N/A'} size="small" sx={{ bgcolor: '#E8F5E9' }} />
                          </TableCell>
                          <TableCell>{video.duration || 'N/A'}</TableCell>
                          <TableCell>{video.views || 0}</TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <Button 
                                variant="outlined" 
                                size="small"
                                onClick={() => handleOpenVideoDialog(video)}
                                sx={{
                                  color: '#95D6C2',
                                  borderColor: '#95D6C2',
                                  '&:hover': {
                                    borderColor: '#7bc4b0',
                                    bgcolor: '#F1FDF0'
                                  },
                                  textTransform: 'none',
                                  fontSize: 12
                                }}
                              >
                                Modifier
                              </Button>
                              <Button 
                                variant="outlined" 
                                size="small"
                                onClick={() => handleDeleteVideo(video._id)}
                                sx={{
                                  color: '#e74c3c',
                                  borderColor: '#e74c3c',
                                  '&:hover': {
                                    borderColor: '#c0392b',
                                    bgcolor: '#fee'
                                  },
                                  textTransform: 'none',
                                  fontSize: 12
                                }}
                              >
                                Supprimer
                              </Button>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Box>

        {/* Experience Cards Section */}
        <Box ref={experienceCardsRef} mt={4}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 700, color: '#2C3E50' }}>
            Gestion des Cartes d'Expérience
          </Typography>
          <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid #E0E0E0' }}>
            <CardContent sx={{ p: 3 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} flexWrap="wrap" gap={2}>
                <Typography variant="body2" color="text.secondary">
                  Gérez les récits d'expérience partagés par les jeunes
                </Typography>
                <Button 
                  variant="contained" 
                  startIcon={<AddIcon />}
                  onClick={() => handleOpenCardDialog()}
                  sx={{
                    bgcolor: '#95D6C2',
                    '&:hover': { bgcolor: '#7bc4b0' },
                    textTransform: 'none',
                    borderRadius: 2,
                    px: 3
                  }}
                >
                  Nouvelle Carte
                </Button>
              </Box>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: '#F8F9FA' }}>
                      <TableCell sx={{ fontWeight: 600, fontSize: 12, textTransform: 'uppercase' }}>Titre</TableCell>
                      <TableCell sx={{ fontWeight: 600, fontSize: 12, textTransform: 'uppercase', display: { xs: 'none', md: 'table-cell' } }}>Auteur</TableCell>
                      <TableCell sx={{ fontWeight: 600, fontSize: 12, textTransform: 'uppercase', display: { xs: 'none', md: 'table-cell' } }}>Tags</TableCell>
                      <TableCell sx={{ fontWeight: 600, fontSize: 12, textTransform: 'uppercase' }}>Date</TableCell>
                      <TableCell sx={{ fontWeight: 600, fontSize: 12, textTransform: 'uppercase' }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={5} align="center">Chargement...</TableCell>
                      </TableRow>
                    ) : experienceCards.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} align="center">Aucune carte d'expérience</TableCell>
                      </TableRow>
                    ) : (
                      experienceCards.map((card) => (
                        <TableRow key={card._id} hover>
                          <TableCell>{card.title}</TableCell>
                          <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>{card.author?.name || 'N/A'}</TableCell>
                          <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                            <Chip label={card.tag || 'N/A'} size="small" sx={{ bgcolor: '#E3F2FD', fontSize: 10 }} />
                          </TableCell>
                          <TableCell>{new Date(card.createdAt).toLocaleDateString('fr-FR')}</TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <Button 
                                variant="outlined" 
                                size="small"
                                onClick={() => handleOpenCardDialog(card)}
                                sx={{
                                  color: '#95D6C2',
                                  borderColor: '#95D6C2',
                                  '&:hover': {
                                    borderColor: '#7bc4b0',
                                    bgcolor: '#F1FDF0'
                                  },
                                  textTransform: 'none',
                                  fontSize: 12
                                }}
                              >
                                Modifier
                              </Button>
                              <Button 
                                variant="outlined" 
                                size="small"
                                onClick={() => handleDeleteExperienceCard(card._id)}
                                sx={{
                                  color: '#e74c3c',
                                  borderColor: '#e74c3c',
                                  '&:hover': {
                                    borderColor: '#c0392b',
                                    bgcolor: '#fee'
                                  },
                                  textTransform: 'none',
                                  fontSize: 12
                                }}
                              >
                                Supprimer
                              </Button>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Box>

        {/* Experience Sessions Section */}
        <Box ref={experienceSessionsRef} mt={4}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 700, color: '#2C3E50' }}>
            Gestion des Sessions d'Expérience
          </Typography>
          <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid #E0E0E0' }}>
            <CardContent sx={{ p: 3 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} flexWrap="wrap" gap={2}>
                <Typography variant="body2" color="text.secondary">
                  Organisez des sessions de partage d'expérience avec des speakers
                </Typography>
                <Button 
                  variant="contained" 
                  startIcon={<AddIcon />}
                  onClick={() => handleOpenSessionDialog()}
                  sx={{
                    bgcolor: '#95D6C2',
                    '&:hover': { bgcolor: '#7bc4b0' },
                    textTransform: 'none',
                    borderRadius: 2,
                    px: 3
                  }}
                >
                  Nouvelle Session
                </Button>
              </Box>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: '#F8F9FA' }}>
                      <TableCell sx={{ fontWeight: 600, fontSize: 12, textTransform: 'uppercase' }}>Titre</TableCell>
                      <TableCell sx={{ fontWeight: 600, fontSize: 12, textTransform: 'uppercase' }}>Date</TableCell>
                      <TableCell sx={{ fontWeight: 600, fontSize: 12, textTransform: 'uppercase', display: { xs: 'none', md: 'table-cell' } }}>Speaker</TableCell>
                      <TableCell sx={{ fontWeight: 600, fontSize: 12, textTransform: 'uppercase' }}>Participants</TableCell>
                      <TableCell sx={{ fontWeight: 600, fontSize: 12, textTransform: 'uppercase' }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={5} align="center">Chargement...</TableCell>
                      </TableRow>
                    ) : experienceSessions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} align="center">Aucune session d'expérience</TableCell>
                      </TableRow>
                    ) : (
                      experienceSessions.map((session) => (
                        <TableRow key={session._id} hover>
                          <TableCell>{session.title}</TableCell>
                          <TableCell>{new Date(session.date).toLocaleDateString('fr-FR')} {session.time}</TableCell>
                          <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>{session.author?.name || 'N/A'}</TableCell>
                          <TableCell>{session.participants?.length || 0}</TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <Button 
                                variant="outlined" 
                                size="small"
                                onClick={() => handleOpenSessionDialog(session)}
                                sx={{
                                  color: '#95D6C2',
                                  borderColor: '#95D6C2',
                                  '&:hover': {
                                    borderColor: '#7bc4b0',
                                    bgcolor: '#F1FDF0'
                                  },
                                  textTransform: 'none',
                                  fontSize: 12
                                }}
                              >
                                Modifier
                              </Button>
                              <Button 
                                variant="outlined" 
                                size="small"
                                onClick={() => handleDeleteExperienceSession(session._id)}
                                sx={{
                                  color: '#e74c3c',
                                  borderColor: '#e74c3c',
                                  '&:hover': {
                                    borderColor: '#c0392b',
                                    bgcolor: '#fee'
                                  },
                                  textTransform: 'none',
                                  fontSize: 12
                                }}
                              >
                                Supprimer
                              </Button>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Box>
      </Box>
      
      {/* Event Dialog */}
      <Dialog open={eventDialogOpen} onClose={handleCloseEventDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingEvent ? 'Modifier l\'événement' : 'Nouvel événement'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Titre"
              fullWidth
              value={eventForm.title}
              onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
              required
            />
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={3}
              value={eventForm.description}
              onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
            />
            <TextField
              label="Date"
              type="date"
              fullWidth
              value={eventForm.date}
              onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
              InputLabelProps={{ shrink: true }}
              required
            />
            <TextField
              label="Lieu"
              fullWidth
              value={eventForm.location}
              onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
              required
            />
            <FormControl fullWidth>
              <InputLabel>Catégorie</InputLabel>
              <Select
                value={eventForm.category}
                label="Catégorie"
                onChange={(e) => setEventForm({ ...eventForm, category: e.target.value })}
              >
                <MenuItem value="cultural">Culturel</MenuItem>
                <MenuItem value="sports">Sport</MenuItem>
                <MenuItem value="educational">Éducatif</MenuItem>
                <MenuItem value="social">Social</MenuItem>
                <MenuItem value="artistic">Artistique</MenuItem>
                <MenuItem value="technological">Technologique</MenuItem>
                <MenuItem value="environmental">Environnemental</MenuItem>
                <MenuItem value="health">Santé</MenuItem>
                <MenuItem value="volunteering">Bénévolat</MenuItem>
                <MenuItem value="other">Autre</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Nombre maximum de participants"
              type="number"
              fullWidth
              value={eventForm.maxParticipants}
              onChange={(e) => setEventForm({ ...eventForm, maxParticipants: e.target.value })}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEventDialog}>Annuler</Button>
          <Button 
            onClick={handleSaveEvent} 
            variant="contained"
            sx={{ bgcolor: '#95D6C2', '&:hover': { bgcolor: '#7bc4b0' } }}
          >
            {editingEvent ? 'Mettre à jour' : 'Créer'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Club Dialog */}
      <Dialog open={clubDialogOpen} onClose={handleCloseClubDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingClub ? 'Modifier le club' : 'Nouveau club'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Nom du club"
              fullWidth
              value={clubForm.name}
              onChange={(e) => setClubForm({ ...clubForm, name: e.target.value })}
              required
            />
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={3}
              value={clubForm.description}
              onChange={(e) => setClubForm({ ...clubForm, description: e.target.value })}
            />
            <FormControl fullWidth>
              <InputLabel>Catégorie</InputLabel>
              <Select
                value={clubForm.category}
                label="Catégorie"
                onChange={(e) => setClubForm({ ...clubForm, category: e.target.value })}
              >
                <MenuItem value="music">Musique</MenuItem>
                <MenuItem value="sports">Sport</MenuItem>
                <MenuItem value="arts">Arts</MenuItem>
                <MenuItem value="technology">Technologie</MenuItem>
                <MenuItem value="science">Science</MenuItem>
                <MenuItem value="literature">Littérature</MenuItem>
                <MenuItem value="debate">Débat</MenuItem>
                <MenuItem value="volunteering">Bénévolat</MenuItem>
                <MenuItem value="environment">Environnement</MenuItem>
                <MenuItem value="other">Autre</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Horaire des réunions"
              fullWidth
              value={clubForm.meetingSchedule}
              onChange={(e) => setClubForm({ ...clubForm, meetingSchedule: e.target.value })}
              placeholder="Ex: Tous les mercredis à 16h"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseClubDialog}>Annuler</Button>
          <Button 
            onClick={handleSaveClub} 
            variant="contained"
            sx={{ bgcolor: '#95D6C2', '&:hover': { bgcolor: '#7bc4b0' } }}
          >
            {editingClub ? 'Mettre à jour' : 'Créer'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Workshop Dialog */}
      <Dialog open={workshopDialogOpen} onClose={() => setWorkshopDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>{editingWorkshop ? 'Modifier l\'atelier' : 'Nouvel atelier'}</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField label="Titre" fullWidth value={workshopForm.title} onChange={(e) => setWorkshopForm({ ...workshopForm, title: e.target.value })} required />
            <TextField label="Description" fullWidth multiline rows={3} value={workshopForm.description} onChange={(e) => setWorkshopForm({ ...workshopForm, description: e.target.value })} />
            <TextField label="Date" type="date" fullWidth value={workshopForm.date} onChange={(e) => setWorkshopForm({ ...workshopForm, date: e.target.value })} InputLabelProps={{ shrink: true }} required />
            <TextField label="Mentor" fullWidth value={workshopForm.mentor} onChange={(e) => setWorkshopForm({ ...workshopForm, mentor: e.target.value })} />
            <TextField label="Durée (minutes)" type="number" fullWidth value={workshopForm.duration} onChange={(e) => setWorkshopForm({ ...workshopForm, duration: e.target.value })} />
            <TextField label="Prix (DZD)" type="number" fullWidth value={workshopForm.price} onChange={(e) => setWorkshopForm({ ...workshopForm, price: e.target.value })} />
            <TextField label="Participants max" type="number" fullWidth value={workshopForm.maxParticipants} onChange={(e) => setWorkshopForm({ ...workshopForm, maxParticipants: e.target.value })} />
            <FormControl fullWidth>
              <InputLabel>Catégorie</InputLabel>
              <Select value={workshopForm.category} label="Catégorie" onChange={(e) => setWorkshopForm({ ...workshopForm, category: e.target.value })}>
                <MenuItem value="technology">Technologie</MenuItem>
                <MenuItem value="arts">Arts</MenuItem>
                <MenuItem value="business">Business</MenuItem>
                <MenuItem value="health">Santé</MenuItem>
                <MenuItem value="sports">Sport</MenuItem>
                <MenuItem value="other">Autre</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setWorkshopDialogOpen(false)}>Annuler</Button>
          <Button onClick={handleSaveWorkshop} variant="contained" sx={{ bgcolor: '#95D6C2', '&:hover': { bgcolor: '#7bc4b0' } }}>
            {editingWorkshop ? 'Mettre à jour' : 'Créer'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Video Dialog */}
      <Dialog open={videoDialogOpen} onClose={() => setVideoDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>{editingVideo ? 'Modifier la vidéo' : 'Nouvelle vidéo'}</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField label="Titre" fullWidth value={videoForm.title} onChange={(e) => setVideoForm({ ...videoForm, title: e.target.value })} required />
            <TextField label="Description" fullWidth multiline rows={3} value={videoForm.description} onChange={(e) => setVideoForm({ ...videoForm, description: e.target.value })} />
            <TextField label="URL vidéo" fullWidth value={videoForm.url} onChange={(e) => setVideoForm({ ...videoForm, url: e.target.value })} required />
            <FormControl fullWidth>
              <InputLabel>Catégorie</InputLabel>
              <Select value={videoForm.category} label="Catégorie" onChange={(e) => setVideoForm({ ...videoForm, category: e.target.value })}>
                <MenuItem value="coding">Codage</MenuItem>
                <MenuItem value="arts">Arts</MenuItem>
                <MenuItem value="entrepreneurship">Entrepreneuriat</MenuItem>
                <MenuItem value="design">Design</MenuItem>
                <MenuItem value="science">Science</MenuItem>
                <MenuItem value="other">Autre</MenuItem>
              </Select>
            </FormControl>
            <TextField label="Durée (ex: 15:30)" fullWidth value={videoForm.duration} onChange={(e) => setVideoForm({ ...videoForm, duration: e.target.value })} />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setVideoDialogOpen(false)}>Annuler</Button>
          <Button onClick={handleSaveVideo} variant="contained" sx={{ bgcolor: '#95D6C2', '&:hover': { bgcolor: '#7bc4b0' } }}>
            {editingVideo ? 'Mettre à jour' : 'Créer'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Experience Card Dialog */}
      <Dialog open={cardDialogOpen} onClose={() => setCardDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>{editingCard ? 'Modifier la carte' : 'Nouvelle carte d\'expérience'}</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField label="Titre" fullWidth value={cardForm.title} onChange={(e) => setCardForm({ ...cardForm, title: e.target.value })} required />
            <TextField label="Résumé" fullWidth multiline rows={3} value={cardForm.summary} onChange={(e) => setCardForm({ ...cardForm, summary: e.target.value })} />
            <TextField label="Leçons apprises" fullWidth multiline rows={3} value={cardForm.lessons} onChange={(e) => setCardForm({ ...cardForm, lessons: e.target.value })} />
            <FormControl fullWidth>
              <InputLabel>Tag</InputLabel>
              <Select value={cardForm.tag} label="Tag" onChange={(e) => setCardForm({ ...cardForm, tag: e.target.value })}>
                <MenuItem value="stage">Stage</MenuItem>
                <MenuItem value="tech">Tech</MenuItem>
                <MenuItem value="volunteering">Bénévolat</MenuItem>
                <MenuItem value="education">Éducation</MenuItem>
                <MenuItem value="other">Autre</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCardDialogOpen(false)}>Annuler</Button>
          <Button onClick={handleSaveCard} variant="contained" sx={{ bgcolor: '#95D6C2', '&:hover': { bgcolor: '#7bc4b0' } }}>
            {editingCard ? 'Mettre à jour' : 'Créer'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Experience Session Dialog */}
      <Dialog open={sessionDialogOpen} onClose={() => setSessionDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>{editingSession ? 'Modifier la session' : 'Nouvelle session d\'expérience'}</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField label="Titre" fullWidth value={sessionForm.title} onChange={(e) => setSessionForm({ ...sessionForm, title: e.target.value })} required />
            <TextField label="Description" fullWidth multiline rows={3} value={sessionForm.description} onChange={(e) => setSessionForm({ ...sessionForm, description: e.target.value })} />
            <TextField label="Date" type="date" fullWidth value={sessionForm.date} onChange={(e) => setSessionForm({ ...sessionForm, date: e.target.value })} InputLabelProps={{ shrink: true }} required />
            <TextField label="Heure (ex: 14:00)" fullWidth value={sessionForm.time} onChange={(e) => setSessionForm({ ...sessionForm, time: e.target.value })} />
            <FormControl fullWidth>
              <InputLabel>Tag</InputLabel>
              <Select value={sessionForm.tag} label="Tag" onChange={(e) => setSessionForm({ ...sessionForm, tag: e.target.value })}>
                <MenuItem value="entrepreneurship">Entrepreneuriat</MenuItem>
                <MenuItem value="tech">Tech</MenuItem>
                <MenuItem value="culture">Culture</MenuItem>
                <MenuItem value="volunteering">Bénévolat</MenuItem>
                <MenuItem value="other">Autre</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSessionDialogOpen(false)}>Annuler</Button>
          <Button onClick={handleSaveSession} variant="contained" sx={{ bgcolor: '#95D6C2', '&:hover': { bgcolor: '#7bc4b0' } }}>
            {editingSession ? 'Mettre à jour' : 'Créer'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Snackbar for notifications */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={4000} 
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
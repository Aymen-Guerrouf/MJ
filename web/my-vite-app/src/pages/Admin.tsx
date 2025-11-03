// ============================================
// FILE: src/pages/Admin.tsx
// ============================================

import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

// Import UI Components
import { StatCard } from '../components/ui/StatCard';
import { EntityTable } from '../components/ui/EntityTable';
import { FormDialog } from '../components/ui/FormDialog';
import { Drawer } from '../components/ui/Drawer';
import { AppBar } from '../components/ui/AppBar';
import { Sidebar } from '../components/ui/Sidebar';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Snackbar } from '../components/ui/Snackbar';
import { Chip } from '../components/ui/Chip';

// Import Recharts for charts
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
  Bar
} from 'recharts';

// Import API functions (your existing API)
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
  deleteExperienceSession
} from '../services/api.js';

const DRAWER_WIDTH = 280;

export default function Admin() {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopOpen, setDesktopOpen] = useState(true);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [adminData, setAdminData] = useState(null);

  // Data states
  const [events, setEvents] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [workshops, setWorkshops] = useState([]);
  const [videos, setVideos] = useState([]);
  const [experienceCards, setExperienceCards] = useState([]);
  const [experienceSessions, setExperienceSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const data = await AdminDashboard();
      setAdminData(data);
    };
    fetchData();
  }, []);
  // Dialog states
  const [eventDialogOpen, setEventDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    category: '',
    maxParticipants: ''
  });

  const [clubDialogOpen, setClubDialogOpen] = useState(false);
  const [editingClub, setEditingClub] = useState(null);
  const [clubForm, setClubForm] = useState({
    name: '',
    description: '',
    category: '',
    meetingSchedule: ''
  });

  const [workshopDialogOpen, setWorkshopDialogOpen] = useState(false);
  const [editingWorkshop, setEditingWorkshop] = useState(null);
  const [workshopForm, setWorkshopForm] = useState({
    title: '',
    description: '',
    date: '',
    mentor: '',
    duration: '',
    price: '',
    maxParticipants: '',
    category: ''
  });

  const [videoDialogOpen, setVideoDialogOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState(null);
  const [videoForm, setVideoForm] = useState({
    title: '',
    description: '',
    url: '',
    category: '',
    duration: ''
  });

  const [cardDialogOpen, setCardDialogOpen] = useState(false);
  const [editingCard, setEditingCard] = useState(null);
  const [cardForm, setCardForm] = useState({
    title: '',
    summary: '',
    lessons: '',
    tag: ''
  });

  const [sessionDialogOpen, setSessionDialogOpen] = useState(false);
  const [editingSession, setEditingSession] = useState(null);
  const [sessionForm, setSessionForm] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    tag: ''
  });

  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Refs for scrolling
  const dashboardRef = useRef(null);
  const inscriptionsRef = useRef(null);
  const eventsRef = useRef(null);
  const clubsRef = useRef(null);
  const workshopsRef = useRef(null);
  const videosRef = useRef(null);
  const experienceCardsRef = useRef(null);
  const experienceSessionsRef = useRef(null);
  const analyticsRef = useRef(null);

  // Check if mobile
  const isMobile = window.innerWidth < 768;

  // Fetch admin data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await AdminDashboard();
        setAdminData(data);
      } catch (err) {
        console.error('Admin dashboard error:', err);
        if (err.response?.status === 401) {
          setSnackbar({ open: true, message: 'Session expirée. Veuillez vous reconnecter.', severity: 'error' });
          setTimeout(() => navigate('/'), 2000);
        }
      }
    };
    fetchData();
  }, [navigate]);

  // Fetch all data
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [eventsData, clubsData, workshopsData, videosData, cardsData, sessionsData] = await Promise.all([
        getAllEvents().catch(() => []),
        getAllClubs().catch(() => []),
        getAllWorkshops().catch(() => []),
        getAllVideos().catch(() => []),
        getAllExperienceCards().catch(() => []),
        getAllExperienceSessions().catch(() => [])
      ]);

      setEvents(Array.isArray(eventsData) ? eventsData : []);
      setClubs(Array.isArray(clubsData) ? clubsData : []);
      setWorkshops(Array.isArray(workshopsData) ? workshopsData : []);
      setVideos(Array.isArray(videosData) ? videosData : []);
      setExperienceCards(Array.isArray(cardsData) ? cardsData : []);
      setExperienceSessions(Array.isArray(sessionsData) ? sessionsData : []);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleDrawerToggle = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen);
    } else {
      setDesktopOpen(!desktopOpen);
    }
  };

  const scrollToSection = (item) => {
    setActiveSection(item.section);
    if (isMobile) setMobileOpen(false);
    setTimeout(() => {
      item.ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  // Event handlers
  const handleOpenEventDialog = (event = null) => {
    if (event) {
      setEditingEvent(event);
      setEventForm({
        title: event.title,
        description: event.description || '',
        date: event.date?.split('T')[0] || '',
        location: event.location,
        category: event.category || '',
        maxParticipants: event.maxParticipants?.toString() || ''
      });
    } else {
      setEditingEvent(null);
      setEventForm({ title: '', description: '', date: '', location: '', category: '', maxParticipants: '' });
    }
    setEventDialogOpen(true);
  };

  const handleSaveEvent = async () => {
    try {
      const eventData = {
        ...eventForm,
        maxParticipants: eventForm.maxParticipants ? parseInt(eventForm.maxParticipants) : undefined
      };

      if (editingEvent) {
        const updated = await updateEvent(editingEvent._id, eventData);
        setEvents(events.map((e) => (e._id === editingEvent._id ? updated : e)));
        setSnackbar({ open: true, message: 'Événement mis à jour avec succès', severity: 'success' });
      } else {
        eventData.centerId = adminData.centerId;
        const newEvent = await createEvent(eventData);
        setEvents([...events, newEvent]);
        setSnackbar({ open: true, message: 'Événement créé avec succès', severity: 'success' });
      }
      setEventDialogOpen(false);
      setEditingEvent(null);
    } catch (err) {
      setSnackbar({ open: true, message: err.response?.data?.message || 'Erreur', severity: 'error' });
    }
  };
console.log(adminData);

  const handleDeleteEvent = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet événement?')) return;
    try {
      await deleteEvent(id);
      setEvents(events.filter((e) => e._id !== id));
    } catch (err) {
      alert('Erreur lors de la suppression');
    }
  };

  // Similar handlers for clubs, workshops, videos, cards, sessions...
  const handleOpenClubDialog = (club = null) => {
    if (club) {
      setEditingClub(club);
      setClubForm({
        name: club.name,
        description: club.description || '',
        category: club.category || '',
        meetingSchedule: club.meetingSchedule || ''
      });
    } else {
      setEditingClub(null);
      setClubForm({ name: '', description: '', category: '', meetingSchedule: '' });
    }
    setClubDialogOpen(true);
  };

  const handleSaveClub = async () => {
    try {
      if (editingClub) {
        const updated = await updateClub(editingClub._id, clubForm);
        setClubs(clubs.map((c) => (c._id === editingClub._id ? updated : c)));
        setSnackbar({ open: true, message: 'Club mis à jour', severity: 'success' });
      } else {
        const newClub = await createClub(clubForm);
        setClubs([...clubs, newClub]);
        setSnackbar({ open: true, message: 'Club créé', severity: 'success' });
      }
      setClubDialogOpen(false);
    } catch (err) {
      setSnackbar({ open: true, message: err.response?.data?.message || 'Erreur', severity: 'error' });
    }
  };

  const handleDeleteClub = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce club?')) return;
    try {
      await deleteClub(id);
      setClubs(clubs.filter((c) => c._id !== id));
    } catch (err) {
      alert('Erreur lors de la suppression');
    }
  };

  //workshsops
  // Example stubs — replace with your real implementations if you have them
const handleOpenWorkshopDialog = (workshop = null) => {
  if (workshop) {
    setEditingWorkshop(workshop);
    setWorkshopForm({
      title: workshop.title || '',
      description: workshop.description || '',
      date: workshop.date?.split('T')[0] || '',
      mentor: workshop.mentor || '',
      duration: workshop.duration?.toString() || '',
      price: workshop.price?.toString() || '',
      maxParticipants: workshop.maxParticipants?.toString() || '',
      category: workshop.category || ''
    });
  } else {
    setEditingWorkshop(null);
    setWorkshopForm({ title: '', description: '', date: '', mentor: '', duration: '', price: '', maxParticipants: '', category: '' });
  }
  setWorkshopDialogOpen(true);
};

const handleDeleteWorkshop = async (id) => {
  if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet atelier?')) return;
  try {
    await deleteWorkshop(id);
    setWorkshops(workshops.filter(w => w._id !== id));
    setSnackbar({ open: true, message: 'Atelier supprimé', severity: 'success' });
  } catch (err) {
    setSnackbar({ open: true, message: 'Erreur lors de la suppression', severity: 'error' });
  }
};

// ------------------ 🔹 Video Handlers ------------------
const handleOpenVideoDialog = (video = null) => {
  if (video) {
    setEditingVideo(video);
    setVideoForm({
      title: video.title || '',
      description: video.description || '',
      url: video.url || '',
      category: video.category || '',
    });
  } else {
    setEditingVideo(null);
    setVideoForm({ title: '', description: '', url: '', category: '' });
  }
  setVideoDialogOpen(true);
};

const handleDeleteVideo = async (id) => {
  if (!window.confirm('Supprimer cette vidéo ?')) return;
  try {
    await deleteVideo(id);
    setVideos(videos.filter(v => v._id !== id));
    setSnackbar({ open: true, message: 'Vidéo supprimée', severity: 'success' });
  } catch (err) {
    setSnackbar({ open: true, message: 'Erreur lors de la suppression', severity: 'error' });
  }
};

// ------------------ 🔹 Card Handlers ------------------
const handleOpenCardDialog = (card = null) => {
  if (card) {
    setEditingCard(card);
    setCardForm({ title: card.title || '', description: card.description || '', image: card.image || '' });
  } else {
    setEditingCard(null);
    setCardForm({ title: '', description: '', image: '' });
  }
  setCardDialogOpen(true);
};

const handleDeleteCard = async (id) => {
  if (!window.confirm('Supprimer cette carte ?')) return;
  try {
    await deleteCard(id);
    setCards(cards.filter(c => c._id !== id));
    setSnackbar({ open: true, message: 'Carte supprimée', severity: 'success' });
  } catch (err) {
    setSnackbar({ open: true, message: 'Erreur lors de la suppression', severity: 'error' });
  }
};

const handleDeleteExperienceCard = async (id) => {
  if (!window.confirm('Supprimer cette carte d’expérience ?')) return;
  try {
    await deleteExperienceCard(id); // use your real API function here
    setExperienceCards(experienceCards.filter(c => c._id !== id));
    setSnackbar({ open: true, message: 'Carte d’expérience supprimée', severity: 'success' });
  } catch (err) {
    console.error(err);
    setSnackbar({ open: true, message: 'Erreur lors de la suppression', severity: 'error' });
  }
};

// ------------------ 🔹 Session Handlers ------------------
const handleOpenSessionDialog = (session = null) => {
  if (session) {
    setEditingSession(session);
    setSessionForm({
      name: session.name || '',
      date: session.date?.split('T')[0] || '',
      duration: session.duration?.toString() || '',
      description: session.description || ''
    });
  } else {
    setEditingSession(null);
    setSessionForm({ name: '', date: '', duration: '', description: '' });
  }
  setSessionDialogOpen(true);
};

const handleDeleteSession = async (id) => {
  if (!window.confirm('Supprimer cette session ?')) return;
  try {
    await deleteSession(id);
    setSessions(sessions.filter(s => s._id !== id));
    setSnackbar({ open: true, message: 'Session supprimée', severity: 'success' });
  } catch (err) {
    setSnackbar({ open: true, message: 'Erreur lors de la suppression', severity: 'error' });
  }
};
const handleDeleteExperienceSession = async (id) => {
  if (!window.confirm('Supprimer cette session d’expérience ?')) return;
  try {
    await deleteExperienceSession(id); // 👈 use your API call here
    setExperienceSessions(experienceSessions.filter(s => s._id !== id));
    setSnackbar({ open: true, message: 'Session d’expérience supprimée', severity: 'success' });
  } catch (err) {
    console.error(err);
    setSnackbar({ open: true, message: 'Erreur lors de la suppression', severity: 'error' });
  }
};

  // Menu items
  const menuItems = [
    { text: 'Mon Tableau de Bord', icon: '🏠', section: 'dashboard', ref: dashboardRef },
    { text: 'Inscriptions des Jeunes', icon: '👥', section: 'inscriptions', ref: inscriptionsRef },
    { text: 'Gestion des Événements', icon: '📅', section: 'events', ref: eventsRef },
    { text: 'Gestion des Clubs', icon: '🎯', section: 'clubs', ref: clubsRef },
    { text: 'Gestion des Workshops', icon: '⚙️', section: 'workshops', ref: workshopsRef },
    { text: 'École Virtuelle (Vidéos)', icon: '🎥', section: 'videos', ref: videosRef },
    { text: 'Cartes d\'Expérience', icon: '🎁', section: 'experienceCards', ref: experienceCardsRef },
    { text: 'Sessions d\'Expérience', icon: '🎤', section: 'experienceSessions', ref: experienceSessionsRef },
    { text: 'Analyses', icon: '📊', section: 'analytics', ref: analyticsRef }
  ];

  // Chart data
  const registrationData = [
    { month: 'Jan', value: 100 }, { month: 'Fév', value: 108 }, { month: 'Mar', value: 118 },
    { month: 'Avr', value: 128 }, { month: 'Mai', value: 135 }, { month: 'Juin', value: 145 },
    { month: 'Juil', value: 152 }, { month: 'Août', value: 148 }, { month: 'Sep', value: 155 },
    { month: 'Oct', value: 160 }, { month: 'Nov', value: 163 }, { month: 'Déc', value: 165 }
  ];

  const clubDistributionData = adminData?.clubcount.length >0 ?adminData?.clubcount?.map((club) => ({
      name: club.name,
      value:  10,
      color: '#' + Math.floor(Math.random() * 16777215).toString(16)
    }))
  : [
    { name: 'Art Club', value: 40, color: '#8884d8' },
    { name: 'Sportif Club', value: 30, color: '#82ca9d' },
    { name: 'Musique Club', value: 20, color: '#ffc658' },
    { name: 'Tech Club', value: 10, color: '#ff8042' }
  ];
  

  const eventParticipationData = [
    { name: 'Atelier Codage', value: 30 }, { name: 'Séance Ciné', value: 50 },
    { name: 'Tournoi E-sport', value: 70 }, { name: 'Journées PO', value: 20 },
    { name: 'Cours Cuisine', value: 45 }
  ];

  // Table columns
  const eventColumns = [
    { label: 'Nom', field: 'title' },
    { label: 'Date', render: (row) => new Date(row.date).toLocaleDateString('fr-FR') },
    { label: 'Lieu', field: 'location', hideOnMobile: true },
    { label: 'Participants', render: (row) => row.registrations?.length || 0 }
  ];

  const clubColumns = [
    { label: 'Nom du Club', field: 'name' },
    { label: 'Activité', field: 'description', hideOnMobile: true, render: (row) => row.description || 'N/A' },
    { label: 'Membres', render: (row) => row.members?.length || 0 }
  ];

  // Form fields
  const eventFields = [
    { name: 'title', label: 'Titre', required: true },
    { name: 'description', label: 'Description', multiline: true, rows: 3 },
    { name: 'date', label: 'Date', type: 'date', required: true },
    { name: 'location', label: 'Lieu', required: true },
    {
      name: 'category',
      label: 'Catégorie',
      type: 'select',
      options: [
        { value: 'cultural', label: 'Culturel' },
        { value: 'sports', label: 'Sport' },
        { value: 'educational', label: 'Éducatif' },
        { value: 'social', label: 'Social' },
        { value: 'other', label: 'Autre' }
      ]
    },
    { name: 'maxParticipants', label: 'Nombre maximum de participants', type: 'number' }
  ];

  const clubFields = [
    { name: 'name', label: 'Nom du club', required: true },
    { name: 'description', label: 'Description', multiline: true, rows: 3 },
    {
      name: 'category',
      label: 'Catégorie',
      type: 'select',
      options: [
        { value: 'music', label: 'Musique' },
        { value: 'sports', label: 'Sport' },
        { value: 'arts', label: 'Arts' },
        { value: 'technology', label: 'Technologie' },
        { value: 'other', label: 'Autre' }
      ]
    },
    { name: 'meetingSchedule', label: 'Horaire des réunions', placeholder: 'Ex: Tous les mercredis à 16h' }
  ];
  // Workshops, Videos, Experience Cards and Sessions columns
const workshopColumns = [
  { label: 'Nom', field: 'title' },
  { label: 'Date', render: row => row.date ? new Date(row.date).toLocaleDateString('fr-FR') : 'N/A' },
  { label: 'Mentor', field: 'mentor', hideOnMobile: true, render: row => row.mentor || 'N/A' },
  { label: 'Participants', render: row => row.enrollments?.length || 0 }
];

const videoColumns = [
  { label: 'Titre', field: 'title' },
  { label: 'Catégorie', field: 'category', hideOnMobile: true, render: row => row.category || 'N/A' },
  { label: 'Durée', field: 'duration', render: row => row.duration || 'N/A' },
  { label: 'Vues', render: row => row.views || 0 }
];

const cardColumns = [
  { label: 'Titre', field: 'title' },
  { label: 'Auteur', field: 'author', hideOnMobile: true, render: row => row.author?.name || 'N/A' },
  { label: 'Tag', field: 'tag', hideOnMobile: true, render: row => row.tag || 'N/A' },
  { label: 'Date', render: row => row.createdAt ? new Date(row.createdAt).toLocaleDateString('fr-FR') : 'N/A' }
];

const sessionColumns = [
  { label: 'Titre', field: 'title' },
  { label: 'Date', render: row => row.date ? `${new Date(row.date).toLocaleDateString('fr-FR')} ${row.time || ''}` : 'N/A' },
  { label: 'Speaker', field: 'author', hideOnMobile: true, render: row => row.author?.name || 'N/A' },
  { label: 'Participants', render: row => row.participants?.length || 0 }
];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F5F7FA' }}>
      {/* AppBar */}
      <AppBar
        onMenuClick={handleDrawerToggle}
        title="Tableau de Bord du Directeur"
        actions={
          <>
            <span style={{ fontSize: '24px', cursor: 'pointer', color: '#95D6C2' }}>🔔</span>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: '#95D6C2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '14px',
                fontWeight: 600
              }}
            >
              FZ
            </div>
          </>
        }
      />

      {/* Mobile Drawer */}
      {isMobile && (
        <Drawer open={mobileOpen} onClose={() => setMobileOpen(false)} width={DRAWER_WIDTH}>
          <Sidebar
            menuItems={menuItems}
            activeSection={activeSection}
            onItemClick={(item) => scrollToSection(item)}
            onLogout={handleLogout}
          />
        </Drawer>
      )}

      {/* Desktop Sidebar */}
      {!isMobile && desktopOpen && (
        <div
          style={{
            position: 'fixed',
            left: 0,
            top: 0,
            bottom: 0,
            width: DRAWER_WIDTH,
            zIndex: 1000
          }}
        >
          <Sidebar
            menuItems={menuItems}
            activeSection={activeSection}
            onItemClick={(item) => scrollToSection(item)}
            onLogout={handleLogout}
          />
        </div>
      )}

      {/* Main Content */}
      <main
        style={{
          flex: 1,
          padding: isMobile ? '16px' : '32px',
          marginTop: '64px',
          marginLeft: !isMobile && desktopOpen ? DRAWER_WIDTH : 0,
          transition: 'margin-left 0.3s ease'
        }}
      >
        {/* Dashboard Stats */}
        <div ref={dashboardRef} style={{ marginBottom: '32px' }}>
          <h2 style={{ marginBottom: '24px', fontSize: '24px', fontWeight: 700, color: '#2C3E50' }}>
            Aperçu Global
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '24px'
            }}
          >
            <StatCard title="Jeunes Inscrits" value={adminData?.userCount?.length ? adminData.userCount.length : 22} icon="👥" color="#95D6C2" />
            <StatCard title="Événements Actifs" value={adminData?.eventCount?.length ? adminData.eventCount.length : 22} icon="📅" color="#F59E0B" />
            <StatCard title="Clubs du Centre" value={adminData?.clubsData?.length ? adminData.clubscount.length : 10} icon="🏠" color="#4AB0E6" />
            {/* <StatCard title="Membres de Clubs" value="80" icon="👥" color="#A855F7" /> */}
          </div>
        </div>

        {/* Analytics Charts */}
        <div ref={analyticsRef} style={{ marginBottom: '32px' }}>
          <h2 style={{ marginBottom: '24px', fontSize: '24px', fontWeight: 700, color: '#2C3E50' }}>
            Analyses et Statistiques
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: '24px' }}>
            <Card title="Évolution des Inscriptions" subtitle="Tendances mensuelles pour votre centre">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={registrationData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#95D6C2" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            <Card title="Répartition par Club" subtitle="Distribution des membres">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={clubDistributionData} dataKey="value" cx="50%" cy="50%" outerRadius={90}>
                    {clubDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '16px', justifyContent: 'center' }}>
                {clubDistributionData.map((item, index) => (
                  <Chip key={index} label={item.name} color={item.color} size="small" />
                ))}
              </div>
            </Card>
          </div>

          <div style={{ marginTop: '24px' }}>
            <Card title="Participation aux Événements" subtitle="Nombre de participants par événement">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={eventParticipationData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" angle={-20} textAnchor="end" interval={0} height={80} tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#F59E0B" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>
        </div>

        {/* Inscriptions Section */}
        <div ref={inscriptionsRef} style={{ marginBottom: '32px' }}>
          <h2 style={{ marginBottom: '24px', fontSize: '24px', fontWeight: 700, color: '#2C3E50' }}>
            Inscriptions des Jeunes
          </h2>
          <Card>
            <p style={{ color: '#6B7280' }}>Section des inscriptions - Contenu à venir</p>
          </Card>
        </div>

        {/* Events Section */}
        <div ref={eventsRef} style={{ marginBottom: '32px' }}>
          <h2 style={{ marginBottom: '24px', fontSize: '24px', fontWeight: 700, color: '#2C3E50' }}>
            Gestion des Événements
          </h2>
          <Card
            title=""
            subtitle="Affichez et gérez les événements de votre centre"
            actions={
              <Button onClick={() => handleOpenEventDialog()} icon="➕">
                Nouvel Événement
              </Button>
            }
          >
            <EntityTable
              columns={eventColumns}
              data={adminData?.eventCount || []}
              loading={loading}
              onEdit={handleOpenEventDialog}
              onDelete={handleDeleteEvent}
            />
          </Card>
        </div>

        {/* Clubs Section */}
        <div ref={clubsRef} style={{ marginBottom: '32px' }}>
          <h2 style={{ marginBottom: '24px', fontSize: '24px', fontWeight: 700, color: '#2C3E50' }}>
            Gestion des Clubs
          </h2>
          <Card
            title=""
            subtitle="Gérez les clubs de votre maison de jeunes"
            actions={
              <Button onClick={() => handleOpenClubDialog()} icon="➕">
                Nouveau Club
              </Button>
            }
          >
            <EntityTable
              columns={clubColumns}
              data={adminData?.clubcount || []}
              loading={loading}
              onEdit={handleOpenClubDialog}
              onDelete={handleDeleteClub}
            />
          </Card>
        </div>

        {/* Workshops Section */}
<div ref={workshopsRef} style={{ marginBottom: '32px' }}>
  <h2 style={{ marginBottom: '24px', fontSize: '24px', fontWeight: 700, color: '#2C3E50' }}>
    Gestion des Workshops
  </h2>
  <Card
    title=""
    subtitle="Gérez les ateliers et formations de votre centre"
    actions={
      <Button onClick={() => handleOpenWorkshopDialog()} icon="➕">
        Nouveau Workshop
      </Button>
    }
  >
    <EntityTable
      columns={workshopColumns}
      data={workshops}
      loading={loading}
      onEdit={handleOpenWorkshopDialog}
      onDelete={handleDeleteWorkshop}
    />
  </Card>
</div>

{/* Videos Section */}
<div ref={videosRef} style={{ marginBottom: '32px' }}>
  <h2 style={{ marginBottom: '24px', fontSize: '24px', fontWeight: 700, color: '#2C3E50' }}>
    École Virtuelle - Gestion des Vidéos
  </h2>
  <Card
    title=""
    subtitle="Téléchargez et gérez les vidéos éducatives"
    actions={
      <Button onClick={() => handleOpenVideoDialog()} icon="➕">
        Nouvelle Vidéo
      </Button>
    }
  >
    <EntityTable
      columns={videoColumns}
      data={videos}
      loading={loading}
      onEdit={handleOpenVideoDialog}
      onDelete={handleDeleteVideo}
    />
  </Card>
</div>

{/* Experience Cards Section */}
<div ref={experienceCardsRef} style={{ marginBottom: '32px' }}>
  <h2 style={{ marginBottom: '24px', fontSize: '24px', fontWeight: 700, color: '#2C3E50' }}>
    Gestion des Cartes d'Expérience
  </h2>
  <Card
    title=""
    subtitle="Gérez les récits d'expérience partagés par les jeunes"
    actions={
      <Button onClick={() => handleOpenCardDialog()} icon="➕">
        Nouvelle Carte
      </Button>
    }
  >
    <EntityTable
      columns={cardColumns}
      data={experienceCards}
      loading={loading}
      onEdit={handleOpenCardDialog}
      onDelete={handleDeleteExperienceCard}
    />
  </Card>
</div>

{/* Experience Sessions Section */}
<div ref={experienceSessionsRef} style={{ marginBottom: '32px' }}>
  <h2 style={{ marginBottom: '24px', fontSize: '24px', fontWeight: 700, color: '#2C3E50' }}>
    Gestion des Sessions d'Expérience
  </h2>
  <Card
    title=""
    subtitle="Organisez des sessions de partage d'expérience avec des speakers"
    actions={
      <Button onClick={() => handleOpenSessionDialog()} icon="➕">
        Nouvelle Session
      </Button>
    }
  >
    <EntityTable
      columns={sessionColumns}
      data={experienceSessions}
      loading={loading}
      onEdit={handleOpenSessionDialog}
      onDelete={handleDeleteExperienceSession}
    />
  </Card>
</div>

        {/* Additional sections would follow the same pattern... */}
      </main>

      {/* Dialogs */}
      <FormDialog
        open={eventDialogOpen}
        onClose={() => setEventDialogOpen(false)}
        title={editingEvent ? "Modifier l'événement" : 'Nouvel événement'}
        fields={eventFields}
        formData={eventForm}
        onChange={(name, value) => setEventForm({ ...eventForm, [name]: value })}
        onSave={handleSaveEvent}
        isEditing={!!editingEvent}
      />

      <FormDialog
        open={clubDialogOpen}
        onClose={() => setClubDialogOpen(false)}
        title={editingClub ? 'Modifier le club' : 'Nouveau club'}
        fields={clubFields}
        formData={clubForm}
        onChange={(name, value) => setClubForm({ ...clubForm, [name]: value })}
        onSave={handleSaveClub}
        isEditing={!!editingClub}
      />

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      />
    </div>
  );
}
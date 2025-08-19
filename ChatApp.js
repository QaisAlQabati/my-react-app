import React, { useState, useEffect, useRef } from 'react';
import { Send, Users, LogIn, UserPlus, MessageCircle, Globe, Crown, Shield, Settings, Ban, UserCheck, MessageSquare, Flag, Image, Code, X, Camera, File, User, Heart, Music, Play, Pause, Edit3, Save, Plus, Eye, UserX } from 'lucide-react';

const KhatroAqrabChat = () => {
  const [user, setUser] = useState(null);
  const [currentRoom, setCurrentRoom] = useState('عام');
  const [chatMode, setChatMode] = useState('public'); // 'public', 'private', 'profile'
  const [privateChatWith, setPrivateChatWith] = useState(null);
  const [viewingProfile, setViewingProfile] = useState(null);
  const [editingProfile, setEditingProfile] = useState(false);
  const [rooms] = useState(['عام', 'السعودية', 'مصر', 'سوريا', 'اليمن']);
  
  // نظام الملفات الشخصية
  const [userProfiles, setUserProfiles] = useState({
    'أحمد_الرياض': {
      name: 'أحمد_الرياض',
      age: 25,
      gender: 'male',
      bio: 'مطور من الرياض، أحب البرمجة والتقنية',
      profilePic: null,
      coverPic: null,
      favoriteSong: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
      followers: ['فاطمة_القاهرة'],
      following: ['محمد_دمشق'],
      posts: [
        { id: 1, content: 'مرحباً بالجميع في دردشة خطروعقرب!', timestamp: new Date(Date.now() - 3600000), likes: 5 }
      ],
      type: 'member'
    },
    'فاطمة_القاهرة': {
      name: 'فاطمة_القاهرة',
      age: 22,
      gender: 'female',
      bio: 'طالبة طب من القاهرة، أحب القراءة والموسيقى',
      profilePic: null,
      coverPic: null,
      favoriteSong: null,
      followers: ['محمد_دمشق'],
      following: ['أحمد_الرياض'],
      posts: [
        { id: 1, content: 'يوم جميل للدردشة مع الأصدقاء', timestamp: new Date(Date.now() - 7200000), likes: 3 }
      ],
      type: 'vip'
    },
    'محمد_دمشق': {
      name: 'محمد_دمشق',
      age: 30,
      gender: 'male',
      bio: 'مهندس برمجيات ومدير في دردشة خطروعقرب',
      profilePic: null,
      coverPic: null,
      favoriteSong: null,
      followers: ['أحمد_الرياض', 'فاطمة_القاهرة'],
      following: [],
      posts: [
        { id: 1, content: 'مرحباً بكم جميعاً! نسعى لجعل هذه المنصة الأفضل', timestamp: new Date(Date.now() - 1800000), likes: 8 }
      ],
      type: 'admin'
    }
  });

  const [roomMessages, setRoomMessages] = useState({
    'عام': [
      {
        id: 1,
        username: 'المرحب',
        message: '🏝️ أهلاً وسهلاً بكم في الغرفة العامة - دردشة خطروعقرب! 🌍\nهنا يمكنكم التحدث بحرية كاملة، مشاركة الصور، الأكواد، وكل شيء!',
        timestamp: new Date(Date.now() - 60000),
        isSystem: true
      }
    ],
    'السعودية': [
      {
        id: 1,
        username: 'مرحب السعودية',
        message: '🇸🇦 أهلاً وسهلاً بكم في غرفة السعودية - دردشة حرة بلا قيود! 🇸🇦',
        timestamp: new Date(Date.now() - 30000),
        isSystem: true
      }
    ],
    'مصر': [
      {
        id: 1,
        username: 'مرحب مصر',
        message: '🇪🇬 أهلاً وسهلاً بكم في غرفة مصر أم الدنيا - تحدثوا بحرية! 🇪🇬',
        timestamp: new Date(Date.now() - 30000),
        isSystem: true
      }
    ],
    'سوريا': [
      {
        id: 1,
        username: 'مرحب سوريا',
        message: '🇸🇾 أهلاً وسهلاً بكم في غرفة سوريا الحبيبة - دردشة مفتوحة! 🇸🇾',
        timestamp: new Date(Date.now() - 30000),
        isSystem: true
      }
    ],
    'اليمن': [
      {
        id: 1,
        username: 'مرحب اليمن',
        message: '🇾🇪 أهلاً وسهلاً بكم في غرفة اليمن السعيد - تحدثوا بكل حرية! 🇾🇪',
        timestamp: new Date(Date.now() - 30000),
        isSystem: true
      }
    ]
  });
  
  const [privateMessages, setPrivateMessages] = useState({});
  const [newMessage, setNewMessage] = useState('');
  const [newPost, setNewPost] = useState('');
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showGuestForm, setShowGuestForm] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [showPrivateChat, setShowPrivateChat] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [showCodeEditor, setShowCodeEditor] = useState(false);
  const [privateTarget, setPrivateTarget] = useState('');
  const [privateMessage, setPrivateMessage] = useState('');
  const [codeContent, setCodeContent] = useState('');
  const [codeLanguage, setCodeLanguage] = useState('javascript');
  const [selectedImage, setSelectedImage] = useState(null);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ username: '', email: '', password: '' });
  const [guestForm, setGuestForm] = useState({ name: '', age: '', gender: 'male' });
  const [mutedUsers, setMutedUsers] = useState([]);
  const [bannedUsers, setBannedUsers] = useState([]);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [currentAudio, setCurrentAudio] = useState(null);
  
  const [onlineUsers] = useState({
    'عام': [
      { name: 'أحمد_الرياض', type: 'member', room: 'عام', age: 25, gender: 'male' },
      { name: 'فاطمة_القاهرة', type: 'vip', room: 'عام', age: 22, gender: 'female' },
      { name: 'محمد_دمشق', type: 'admin', room: 'عام', age: 30, gender: 'male' },
      { name: 'سارة_جدة', type: 'member', room: 'عام', age: 26, gender: 'female' },
      { name: 'عمر_الإسكندرية', type: 'vip', room: 'عام', age: 28, gender: 'male' }
    ],
    'السعودية': [
      { name: 'سعد_جدة', type: 'member', room: 'السعودية', age: 24, gender: 'male' },
      { name: 'نورا_الدمام', type: 'vip', room: 'السعودية', age: 23, gender: 'female' },
      { name: 'خالد_الطائف', type: 'member', room: 'السعودية', age: 27, gender: 'male' }
    ],
    'مصر': [
      { name: 'أحمد_الإسكندرية', type: 'member', room: 'مصر', age: 25, gender: 'male' },
      { name: 'مريم_الجيزة', type: 'admin', room: 'مصر', age: 29, gender: 'female' },
      { name: 'يوسف_أسوان', type: 'member', room: 'مصر', age: 31, gender: 'male' }
    ],
    'سوريا': [
      { name: 'يوسف_حلب', type: 'member', room: 'سوريا', age: 26, gender: 'male' },
      { name: 'ليلى_اللاذقية', type: 'vip', room: 'سوريا', age: 24, gender: 'female' },
      { name: 'محمد_حمص', type: 'member', room: 'سوريا', age: 28, gender: 'male' }
    ],
    'اليمن': [
      { name: 'علي_صنعاء', type: 'member', room: 'اليمن', age: 30, gender: 'male' },
      { name: 'آمنة_عدن', type: 'member', room: 'اليمن', age: 22, gender: 'female' },
      { name: 'فاطمة_تعز', type: 'vip', room: 'اليمن', age: 25, gender: 'female' }
    ]
  });
  
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const audioRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [roomMessages, currentRoom, privateMessages, chatMode]);

  const isKing = (email) => {
    return email === 'njdj9985@gmail.com';
  };

  const handleLogin = () => {
    if (loginForm.username && loginForm.password) {
      let userType = 'member';
      
      if (loginForm.username.toLowerCase() === 'njdj9985@gmail.com' || registerForm.email === 'njdj9985@gmail.com') {
        userType = 'king';
      } else if (loginForm.username.toLowerCase().includes('admin')) {
        userType = 'admin';
      } else if (loginForm.username.toLowerCase().includes('vip')) {
        userType = 'vip';
      }
      
      const userData = { 
        username: loginForm.username, 
        email: loginForm.username.includes('@') ? loginForm.username : '',
        type: userType 
      };
      
      // إنشاء ملف شخصي تلقائي إذا لم يكن موجوداً
      if (!userProfiles[loginForm.username]) {
        setUserProfiles(prev => ({
          ...prev,
          [loginForm.username]: {
            name: loginForm.username,
            age: 25,
            gender: 'male',
            bio: 'مرحباً، أنا جديد في دردشة خطروعقرب!',
            profilePic: null,
            coverPic: null,
            favoriteSong: null,
            followers: [],
            following: [],
            posts: [],
            type: userType
          }
        }));
      }
      
      setUser(userData);
      setShowLogin(false);
      setLoginForm({ username: '', password: '' });
      addSystemMessage(`👑 ${loginForm.username} ${userType === 'king' ? '(الملك الأعظم)' : ''} انضم إلى غرفة ${currentRoom} - دردشة حرة بلا قيود!`);
    }
  };

  const handleRegister = () => {
    if (registerForm.username && registerForm.email && registerForm.password) {
      let userType = isKing(registerForm.email) ? 'king' : 'member';
      
      const userData = { 
        username: registerForm.username, 
        email: registerForm.email,
        type: userType 
      };
      
      // إنشاء ملف شخصي للمستخدم الجديد
      setUserProfiles(prev => ({
        ...prev,
        [registerForm.username]: {
          name: registerForm.username,
          age: 25,
          gender: 'male',
          bio: 'مرحباً، أنا جديد في دردشة خطروعقرب!',
          profilePic: null,
          coverPic: null,
          favoriteSong: null,
          followers: [],
          following: [],
          posts: [],
          type: userType
        }
      }));
      
      setUser(userData);
      setShowRegister(false);
      setRegisterForm({ username: '', email: '', password: '' });
      addSystemMessage(`👑 مرحباً ${registerForm.username} ${userType === 'king' ? '(الملك الأعظم)' : ''}! تم إنشاء حسابك بنجاح - استمتع بالدردشة الحرة!`);
    }
  };

  const handleGuestLogin = () => {
    if (guestForm.name && guestForm.age && guestForm.gender) {
      const guestName = `${guestForm.name}_زائر`;
      const userData = { 
        username: guestName, 
        email: '', 
        type: 'guest',
        age: parseInt(guestForm.age),
        gender: guestForm.gender
      };
      
      // إنشاء ملف شخصي للزائر
      setUserProfiles(prev => ({
        ...prev,
        [guestName]: {
          name: guestName,
          age: parseInt(guestForm.age),
          gender: guestForm.gender,
          bio: `زائر جديد، ${guestForm.age} سنة`,
          profilePic: null,
          coverPic: null,
          favoriteSong: null,
          followers: [],
          following: [],
          posts: [],
          type: 'guest'
        }
      }));
      
      setUser(userData);
      setShowGuestForm(false);
      setGuestForm({ name: '', age: '', gender: 'male' });
      addSystemMessage(`👋 ${guestName} انضم كزائر إلى غرفة ${currentRoom} - تحدث بحرية كاملة!`);
    }
  };

  const addSystemMessage = (message) => {
    const systemMessage = {
      id: Date.now() + Math.random(),
      username: 'إدارة خطروعقرب',
      message,
      timestamp: new Date(),
      isSystem: true
    };
    
    if (chatMode === 'public') {
      setRoomMessages(prev => ({
        ...prev,
        [currentRoom]: [...(prev[currentRoom] || []), systemMessage]
      }));
    }
  };

  const sendMessage = () => {
    if (newMessage.trim() && user) {
      const message = {
        id: Date.now(),
        username: user.username,
        message: newMessage.trim(),
        timestamp: new Date(),
        userType: user.type,
        type: 'text'
      };
      
      if (chatMode === 'public') {
        setRoomMessages(prev => ({
          ...prev,
          [currentRoom]: [...(prev[currentRoom] || []), message]
        }));
      } else {
        const chatKey = [user.username, privateChatWith].sort().join('-');
        setPrivateMessages(prev => ({
          ...prev,
          [chatKey]: [...(prev[chatKey] || []), message]
        }));
      }
      setNewMessage('');
    }
  };

  const addPost = () => {
    if (newPost.trim() && user) {
      const post = {
        id: Date.now(),
        content: newPost.trim(),
        timestamp: new Date(),
        likes: 0
      };
      
      setUserProfiles(prev => ({
        ...prev,
        [user.username]: {
          ...prev[user.username],
          posts: [...(prev[user.username]?.posts || []), post]
        }
      }));
      
      setNewPost('');
      addSystemMessage(`📝 ${user.username} أضاف منشوراً جديداً في ملفه الشخصي!`);
    }
  };

  const followUser = (targetUsername) => {
    if (user && targetUsername !== user.username) {
      const isFollowing = userProfiles[user.username]?.following?.includes(targetUsername);
      
      if (isFollowing) {
        // إلغاء المتابعة
        setUserProfiles(prev => ({
          ...prev,
          [user.username]: {
            ...prev[user.username],
            following: prev[user.username].following.filter(u => u !== targetUsername)
          },
          [targetUsername]: {
            ...prev[targetUsername],
            followers: prev[targetUsername].followers.filter(u => u !== user.username)
          }
        }));
        addSystemMessage(`💔 ${user.username} ألغى متابعة ${targetUsername}`);
      } else {
        // متابعة
        setUserProfiles(prev => ({
          ...prev,
          [user.username]: {
            ...prev[user.username],
            following: [...(prev[user.username]?.following || []), targetUsername]
          },
          [targetUsername]: {
            ...prev[targetUsername],
            followers: [...(prev[targetUsername]?.followers || []), user.username]
          }
        }));
        addSystemMessage(`❤️ ${user.username} بدأ متابعة ${targetUsername}`);
      }
    }
  };

  const likePost = (postId, profileUsername) => {
    setUserProfiles(prev => ({
      ...prev,
      [profileUsername]: {
        ...prev[profileUsername],
        posts: prev[profileUsername].posts.map(post => 
          post.id === postId ? { ...post, likes: post.likes + 1 } : post
        )
      }
    }));
  };

  const playMusic = (songUrl) => {
    if (currentAudio) {
      currentAudio.pause();
    }
    
    if (songUrl) {
      const audio = new Audio(songUrl);
      audio.play().catch(console.error);
      setCurrentAudio(audio);
      setIsPlayingMusic(true);
      
      audio.onended = () => {
        setIsPlayingMusic(false);
        setCurrentAudio(null);
      };
    }
  };

  const stopMusic = () => {
    if (currentAudio) {
      currentAudio.pause();
      setCurrentAudio(null);
      setIsPlayingMusic(false);
    }
  };

  const updateProfile = (field, value) => {
    setUserProfiles(prev => ({
      ...prev,
      [user.username]: {
        ...prev[user.username],
        [field]: value
      }
    }));
  };

  const sendImage = (imageData) => {
    if (imageData && user) {
      const message = {
        id: Date.now(),
        username: user.username,
        message: imageData,
        timestamp: new Date(),
        userType: user.type,
        type: 'image'
      };
      
      if (chatMode === 'public') {
        setRoomMessages(prev => ({
          ...prev,
          [currentRoom]: [...(prev[currentRoom] || []), message]
        }));
      } else {
        const chatKey = [user.username, privateChatWith].sort().join('-');
        setPrivateMessages(prev => ({
          ...prev,
          [chatKey]: [...(prev[chatKey] || []), message]
        }));
      }
    }
  };

  const sendCode = () => {
    if (codeContent.trim() && user) {
      const message = {
        id: Date.now(),
        username: user.username,
        message: codeContent.trim(),
        timestamp: new Date(),
        userType: user.type,
        type: 'code',
        language: codeLanguage
      };
      
      if (chatMode === 'public') {
        setRoomMessages(prev => ({
          ...prev,
          [currentRoom]: [...(prev[currentRoom] || []), message]
        }));
      } else {
        const chatKey = [user.username, privateChatWith].sort().join('-');
        setPrivateMessages(prev => ({
          ...prev,
          [chatKey]: [...(prev[chatKey] || []), message]
        }));
      }
      
      setCodeContent('');
      setShowCodeEditor(false);
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        sendImage(e.target.result);
        setShowImageUpload(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const startPrivateChat = (targetUser) => {
    setChatMode('private');
    setPrivateChatWith(targetUser);
    
    const chatKey = [user.username, targetUser].sort().join('-');
    if (!privateMessages[chatKey]) {
      setPrivateMessages(prev => ({
        ...prev,
        [chatKey]: [{
          id: Date.now(),
          username: 'النظام',
          message: `💬 بدأت محادثة خاصة مع ${targetUser} - تحدثوا بحرية كاملة!`,
          timestamp: new Date(),
          isSystem: true
        }]
      }));
    }
  };

  const sendPrivateMessage = () => {
    if (privateMessage.trim() && privateTarget.trim() && user?.type === 'king') {
      addSystemMessage(`💌 رسالة خاصة من الملك إلى ${privateTarget}: ${privateMessage}`);
      setPrivateMessage('');
      setPrivateTarget('');
      setShowPrivateChat(false);
    }
  };

  const muteUser = (username) => {
    if (user?.type === 'king' && !mutedUsers.includes(username)) {
      setMutedUsers(prev => [...prev, username]);
      addSystemMessage(`🔇 تم كتم المستخدم ${username} بواسطة الملك`);
    }
  };

  const unmuteUser = (username) => {
    if (user?.type === 'king') {
      setMutedUsers(prev => prev.filter(u => u !== username));
      addSystemMessage(`🔊 تم إلغاء كتم المستخدم ${username} بواسطة الملك`);
    }
  };

  const banUser = (username) => {
    if (user?.type === 'king' && !bannedUsers.includes(username)) {
      setBannedUsers(prev => [...prev, username]);
      addSystemMessage(`🚫 تم حظر المستخدم ${username} نهائياً بواسطة الملك`);
    }
  };

  const promoteUser = (username, newType) => {
    if (user?.type === 'king') {
      addSystemMessage(`⬆️ تم ترقية ${username} إلى ${newType === 'admin' ? 'مدير' : 'عضو مميز'} بواسطة الملك`);
    }
  };

  const switchRoom = (room) => {
    if (chatMode === 'public') {
      addSystemMessage(`👋 ${user.username} غادر غرفة ${currentRoom}`);
      setCurrentRoom(room);
      setTimeout(() => {
        setRoomMessages(prev => ({
          ...prev,
          [room]: [...(prev[room] || []), {
            id: Date.now(),
            username: 'إدارة خطروعقرب',
            message: `🎊 ${user.username} انضم إلى غرفة ${room} - تحدث بحرية!`,
            timestamp: new Date(),
            isSystem: true
          }]
        }));
      }, 100);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('ar-SA', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const getUserIcon = (userType) => {
    switch(userType) {
      case 'king': return <Crown className="w-5 h-5 text-yellow-500 animate-pulse" />;
      case 'admin': return <Shield className="w-4 h-4 text-red-400" />;
      case 'vip': return <Shield className="w-4 h-4 text-purple-400" />;
      default: return null;
    }
  };

  const getGenderIcon = (gender) => {
    return gender === 'male' ? '👨' : '👩';
  };

  const getUserColor = (userType) => {
    switch(userType) {
      case 'king': return 'text-yellow-400 font-bold';
      case 'admin': return 'text-red-400';
      case 'vip': return 'text-purple-400';
      case 'member': return 'text-blue-400';
      case 'guest': return 'text-gray-400';
      default: return 'text-gray-300';
    }
  };

  const getRoomFlag = (room) => {
    switch(room) {
      case 'السعودية': return '🇸🇦';
      case 'مصر': return '🇪🇬';
      case 'سوريا': return '🇸🇾';
      case 'اليمن': return '🇾🇪';
      case 'عام': return '🌍';
      default: return '💬';
    }
  };

  const getCurrentMessages = () => {
    if (chatMode === 'public') {
      return roomMessages[currentRoom] || [];
    } else {
      const chatKey = [user.username, privateChatWith].sort().join('-');
      return privateMessages[chatKey] || [];
    }
  };

  const renderMessage = (msg) => {
    if (msg.type === 'image') {
      return (
        <div className="max-w-xs">
          <img 
            src={msg.message} 
            alt="مشاركة صورة" 
            className="rounded-lg max-w-full h-auto border border-white/20 shadow-lg"
            onClick={() => window.open(msg.message, '_blank')}
            style={{ cursor: 'pointer' }}
          />
        </div>
      );
    } else if (msg.type === 'code') {
      return (
        <div className="bg-gray-900 rounded-lg p-4 border border-gray-600 max-w-2xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <Code className="w-3 h-3" />
              {msg.language}
            </span>
            <button
              onClick={() => navigator.clipboard.writeText(msg.message)}
              className="text-xs text-blue-400 hover:text-blue-300"
            >
              نسخ
            </button>
          </div>
          <pre className="text-sm text-green-300 overflow-x-auto whitespace-pre-wrap">
            <code>{msg.message}</code>
          </pre>
        </div>
      );
    } else {
      return (
        <div className="bg-white/20 backdrop-blur-sm rounded-2xl rounded-tr-sm px-4 py-3 border border-white/10 shadow-lg">
          <p className="text-white leading-relaxed whitespace-pre-wrap">{msg.message}</p>
        </div>
      );
    }
  };

  // صفحة الملف الشخصي
  const renderProfile = (profileUsername) => {
    const profile = userProfiles[profileUsername];
    if (!profile) return null;

    const isOwnProfile = user?.username === profileUsername;
    const isFollowing = user && userProfiles[user.username]?.following?.includes(profileUsername);

    return (
      <div className="h-full overflow-y-auto">
        {/* صورة الغلاف والملف الشخصي */}
        <div className="relative h-48 bg-gradient-to-r from-purple-600 to-blue-600 rounded-t-2xl">
          {profile.coverPic && (
            <img src={profile.coverPic} alt="غلاف" className="w-full h-full object-cover rounded-t-2xl" />
          )}
          
          {/* صورة الملف الشخصي */}
          <div className="absolute -bottom-16 right-6">
            <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden bg-gradient-to-r from-emerald-400 to-cyan-500">
              {profile.profilePic ? (
                <img src={profile.profilePic} alt="الصورة الشخصية" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white text-4xl">
                  {getGenderIcon(profile.gender)}
                </div>
              )}
            </div>
          </div>

          {/* أزرار التحكم */}
          <div className="absolute top-4 left-4 flex gap-2">
            {isOwnProfile && (
              <button
                onClick={() => setEditingProfile(!editingProfile)}
                className="bg-white/20 text-white p-2 rounded-lg hover:bg-white/30 transition-colors backdrop-blur-sm"
                title="تعديل الملف"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => setChatMode('public')}
              className="bg-white/20 text-white p-2 rounded-lg hover:bg-white/30 transition-colors backdrop-blur-sm"
              title="العودة للدردشة"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* معلومات المستخدم */}
        <div className="px-6 pt-20 pb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h2 className={`text-2xl font-bold ${getUserColor(profile.type)}`}>
                  {profile.name}
                </h2>
                {getUserIcon(profile.type)}
                <span className="text-2xl">{getGenderIcon(profile.gender)}</span>
                <span className="text-gray-300 text-lg">({profile.age} سنة)</span>
              </div>
              
              {editingProfile && isOwnProfile ? (
                <div className="space-y-3">
                  <textarea
                    value={profile.bio}
                    onChange={(e) => updateProfile('bio', e.target.value)}
                    placeholder="نبذة شخصية..."
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    rows={3}
                  />
                  <input
                    type="url"
                    value={profile.favoriteSong || ''}
                    onChange={(e) => updateProfile('favoriteSong', e.target.value)}
                    placeholder="رابط الأغنية المفضلة..."
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                  <button
                    onClick={() => setEditingProfile(false)}
                    className="bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600 transition-colors flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    حفظ التغييرات
                  </button>
                </div>
              ) : (
                <p className="text-gray-300 text-lg leading-relaxed mb-4">{profile.bio}</p>
              )}

              {/* إحصائيات المتابعة */}
              <div className="flex gap-6 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-400">{profile.followers?.length || 0}</div>
                  <div className="text-sm text-gray-400">متابع</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-cyan-400">{profile.following?.length || 0}</div>
                  <div className="text-sm text-gray-400">يتابع</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">{profile.posts?.length || 0}</div>
                  <div className="text-sm text-gray-400">منشور</div>
                </div>
              </div>
            </div>

            {/* أزرار التفاعل */}
            {!isOwnProfile && user && (
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => followUser(profileUsername)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2 ${
                    isFollowing 
                      ? 'bg-red-500 text-white hover:bg-red-600' 
                      : 'bg-emerald-500 text-white hover:bg-emerald-600'
                  }`}
                >
                  {isFollowing ? <UserX className="w-4 h-4" /> : <Heart className="w-4 h-4" />}
                  {isFollowing ? 'إلغاء المتابعة' : 'متابعة'}
                </button>
                <button
                  onClick={() => startPrivateChat(profileUsername)}
                  className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 transition-colors flex items-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  رسالة
                </button>
              </div>
            )}
          </div>

          {/* مشغل الموسيقى */}
          {profile.favoriteSong && (
            <div className="bg-white/10 rounded-lg p-4 mb-6 backdrop-blur-sm border border-white/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Music className="w-5 h-5 text-pink-400" />
                  <span className="text-white font-medium">الأغنية المفضلة</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => playMusic(profile.favoriteSong)}
                    disabled={isPlayingMusic}
                    className="bg-pink-500 text-white p-2 rounded-lg hover:bg-pink-600 transition-colors disabled:opacity-50"
                  >
                    <Play className="w-4 h-4" />
                  </button>
                  <button
                    onClick={stopMusic}
                    className="bg-gray-500 text-white p-2 rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    <Pause className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* منطقة إضافة منشور جديد */}
          {isOwnProfile && (
            <div className="bg-white/5 rounded-lg p-4 mb-6 border border-white/10">
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-500 flex items-center justify-center text-white">
                  {getGenderIcon(user.gender || 'male')}
                </div>
                <div className="flex-1">
                  <textarea
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    placeholder="ما الذي تفكر فيه؟ شارك أفكارك بحرية..."
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-emerald-400 resize-none"
                    rows={3}
                  />
                  <div className="flex justify-end mt-2">
                    <button
                      onClick={addPost}
                      disabled={!newPost.trim()}
                      className="bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      نشر
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* المنشورات */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              المنشورات ({profile.posts?.length || 0})
            </h3>
            
            {profile.posts && profile.posts.length > 0 ? (
              profile.posts.slice().reverse().map((post) => (
                <div key={post.id} className="bg-white/10 rounded-lg p-4 border border-white/10 backdrop-blur-sm">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-500 flex items-center justify-center text-white">
                      {getGenderIcon(profile.gender)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`font-semibold ${getUserColor(profile.type)}`}>
                          {profile.name}
                        </span>
                        {getUserIcon(profile.type)}
                        <span className="text-sm text-gray-400">
                          {formatTime(post.timestamp)}
                        </span>
                      </div>
                      <p className="text-white leading-relaxed mb-3">{post.content}</p>
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => likePost(post.id, profileUsername)}
                          className="flex items-center gap-1 text-pink-400 hover:text-pink-300 transition-colors"
                        >
                          <Heart className="w-4 h-4" />
                          <span>{post.likes}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-400">
                <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>لا توجد منشورات بعد</p>
                {isOwnProfile && (
                  <p className="text-sm">أضف أول منشور لك!</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-800 to-cyan-900 flex items-center justify-center p-4" dir="rtl">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 max-w-md w-full border border-white/20 shadow-2xl">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="bg-gradient-to-r from-emerald-400 to-cyan-500 p-4 rounded-full animate-pulse">
                <MessageCircle className="w-12 h-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-emerald-300 to-cyan-300 bg-clip-text text-transparent">
              دردشة خطروعقرب
            </h1>
            <p className="text-emerald-200 flex items-center justify-center gap-2 text-lg">
              <Globe className="w-5 h-5" />
              منصة الدردشة العربية الحرة
            </p>
            <div className="mt-4 text-sm text-cyan-200">
              🆓 دردشة حرة بلا قيود - شارك الصور والأكواد! 🌍
            </div>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => setShowLogin(true)}
              className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <LogIn className="w-5 h-5" />
              تسجيل الدخول
            </button>

            <button
              onClick={() => setShowRegister(true)}
              className="w-full bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white font-semibold py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <UserPlus className="w-5 h-5" />
              إنشاء حساب جديد
            </button>

            <button
              onClick={() => setShowGuestForm(true)}
              className="w-full bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-semibold py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Users className="w-5 h-5" />
              دخول كزائر
            </button>
          </div>
        </div>

        {/* Login Modal */}
        {showLogin && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 max-w-sm w-full border border-white/20">
              <h2 className="text-2xl font-bold text-white mb-6 text-center">تسجيل الدخول</h2>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="اسم المستخدم أو الإيميل"
                  value={loginForm.username}
                  onChange={(e) => setLoginForm({...loginForm, username: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
                <input
                  type="password"
                  placeholder="كلمة المرور"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                  onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
                <div className="flex gap-3">
                  <button
                    onClick={handleLogin}
                    className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 rounded-xl transition-colors"
                  >
                    دخول
                  </button>
                  <button
                    onClick={() => setShowLogin(false)}
                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 rounded-xl transition-colors"
                  >
                    إلغاء
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Register Modal */}
        {showRegister && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 max-w-sm w-full border border-white/20">
              <h2 className="text-2xl font-bold text-white mb-6 text-center">إنشاء حساب جديد</h2>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="اسم المستخدم"
                  value={registerForm.username}
                  onChange={(e) => setRegisterForm({...registerForm, username: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
                <input
                  type="email"
                  placeholder="البريد الإلكتروني"
                  value={registerForm.email}
                  onChange={(e) => setRegisterForm({...registerForm, email: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
                <input
                  type="password"
                  placeholder="كلمة المرور"
                  value={registerForm.password}
                  onChange={(e) => setRegisterForm({...registerForm, password: e.target.value})}
                  onKeyPress={(e) => e.key === 'Enter' && handleRegister()}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
                {registerForm.email === 'njdj9985@gmail.com' && (
                  <div className="text-yellow-400 text-sm text-center animate-pulse">
                    👑 مرحباً بالملك الأعظم! 👑
                  </div>
                )}
                <div className="flex gap-3">
                  <button
                    onClick={handleRegister}
                    className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-3 rounded-xl transition-colors"
                  >
                    إنشاء
                  </button>
                  <button
                    onClick={() => setShowRegister(false)}
                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 rounded-xl transition-colors"
                  >
                    إلغاء
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Guest Form Modal */}
        {showGuestForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 max-w-sm w-full border border-white/20">
              <h2 className="text-2xl font-bold text-white mb-6 text-center">دخول كزائر</h2>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="الاسم"
                  value={guestForm.name}
                  onChange={(e) => setGuestForm({...guestForm, name: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-teal-400"
                />
                <input
                  type="number"
                  placeholder="العمر"
                  value={guestForm.age}
                  onChange={(e) => setGuestForm({...guestForm, age: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-teal-400"
                />
                <select
                  value={guestForm.gender}
                  onChange={(e) => setGuestForm({...guestForm, gender: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-teal-400"
                >
                  <option value="male" className="bg-gray-800">ذكر 👨</option>
                  <option value="female" className="bg-gray-800">أنثى 👩</option>
                </select>
                <div className="flex gap-3">
                  <button
                    onClick={handleGuestLogin}
                    className="flex-1 bg-teal-500 hover:bg-teal-600 text-white font-semibold py-3 rounded-xl transition-colors"
                  >
                    دخول
                  </button>
                  <button
                    onClick={() => setShowGuestForm(false)}
                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 rounded-xl transition-colors"
                  >
                    إلغاء
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-teal-800" dir="rtl">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-lg border-b border-white/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-emerald-400 to-cyan-500 p-3 rounded-lg animate-pulse">
                <MessageCircle className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white bg-gradient-to-r from-emerald-300 to-cyan-300 bg-clip-text text-transparent">
                  دردشة خطروعقرب
                </h1>
                <p className="text-sm text-emerald-200 flex items-center gap-1">
                  {user.type === 'king' ? '👑 الملك الأعظم' : `أهلاً ${user.username}`}
                  {getUserIcon(user.type)}
                  <span className="ml-2">{getGenderIcon(userProfiles[user.username]?.gender || 'male')}</span>
                  {chatMode === 'private' && (
                    <span className="text-pink-300 mr-2">
                      💬 خاص مع {privateChatWith}
                    </span>
                  )}
                  {chatMode === 'profile' && (
                    <span className="text-purple-300 mr-2">
                      👤 عرض الملف الشخصي
                    </span>
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setChatMode('public');
                    setPrivateChatWith(null);
                    setViewingProfile(null);
                  }}
                  className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                    chatMode === 'public' ? 'bg-emerald-500 text-white' : 'bg-white/10 text-emerald-200 hover:bg-white/20'
                  }`}
                >
                  عام
                </button>
                <button
                  onClick={() => {
                    setChatMode('private');
                    setViewingProfile(null);
                  }}
                  className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                    chatMode === 'private' ? 'bg-pink-500 text-white' : 'bg-white/10 text-pink-200 hover:bg-white/20'
                  }`}
                >
                  خاص
                </button>
                <button
                  onClick={() => {
                    setChatMode('profile');
                    setViewingProfile(user.username);
                    setPrivateChatWith(null);
                  }}
                  className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                    chatMode === 'profile' && viewingProfile === user.username ? 'bg-purple-500 text-white' : 'bg-white/10 text-purple-200 hover:bg-white/20'
                  }`}
                >
                  ملفي
                </button>
              </div>
              {user.type === 'king' && (
                <button
                  onClick={() => setShowAdminPanel(true)}
                  className="bg-yellow-500/20 text-yellow-400 px-3 py-2 rounded-lg hover:bg-yellow-500/30 transition-colors flex items-center gap-1"
                >
                  <Settings className="w-4 h-4" />
                  لوحة التحكم
                </button>
              )}
              <span className="text-green-400 text-sm flex items-center gap-2">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                متصل الآن
              </span>
              <button
                onClick={() => {
                  addSystemMessage(`👋 ${user.username} غادر دردشة خطروعقرب`);
                  setUser(null);
                }}
                className="text-red-400 hover:text-red-300 transition-colors px-3 py-1 rounded-lg hover:bg-red-400/10"
              >
                خروج
              </button>
            </div>
          </div>

          {/* Room Tabs - فقط في الوضع العام */}
          {chatMode === 'public' && (
            <div className="flex gap-2 mt-4 overflow-x-auto">
              {rooms.map(room => (
                <button
                  key={room}
                  onClick={() => switchRoom(room)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 whitespace-nowrap ${
                    currentRoom === room
                      ? 'bg-emerald-500 text-white shadow-lg'
                      : 'bg-white/10 text-emerald-200 hover:bg-white/20'
                  }`}
                >
                  <span className="text-lg">{getRoomFlag(room)}</span>
                  {room}
                  <span className="text-xs opacity-60">
                    ({onlineUsers[room]?.length || 0})
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-4 gap-4 h-[calc(100vh-180px)]">
        {/* Users Sidebar */}
        <div className="lg:col-span-1 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-4">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Users className="w-5 h-5" />
            {chatMode === 'public' ? (
              <>
                {getRoomFlag(currentRoom)} غرفة {currentRoom}
                <span className="text-sm">({(onlineUsers[currentRoom]?.length || 0) + 1})</span>
              </>
            ) : chatMode === 'private' ? (
              <>
                💬 المحادثات الخاصة
              </>
            ) : (
              <>
                👥 جميع المستخدمين
              </>
            )}
          </h3>
          
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {/* المستخدم الحالي */}
            <div className="flex items-center gap-2 p-3 bg-emerald-500/20 rounded-lg border border-emerald-400/30">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className={`font-medium ${getUserColor(user.type)} flex-1`}>{user.username}</span>
              <span className="text-lg">{getGenderIcon(userProfiles[user.username]?.gender || 'male')}</span>
              {getUserIcon(user.type)}
              {chatMode === 'profile' && (
                <button
                  onClick={() => {
                    setChatMode('profile');
                    setViewingProfile(user.username);
                  }}
                  className="text-purple-400 hover:text-purple-300 p-1"
                  title="ملفي الشخصي"
                >
                  <User className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* المستخدمون المتصلون */}
            {chatMode === 'public' ? (
              onlineUsers[currentRoom]?.map((roomUser, index) => (
                <div key={index} className="flex items-center gap-2 p-2 hover:bg-white/5 rounded-lg transition-colors group">
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  <span className={`${getUserColor(roomUser.type)} flex-1`}>{roomUser.name}</span>
                  <span className="text-lg">{getGenderIcon(roomUser.gender)}</span>
                  {getUserIcon(roomUser.type)}
                  <div className="opacity-0 group-hover:opacity-100 flex gap-1">
                    <button
                      onClick={() => {
                        setChatMode('profile');
                        setViewingProfile(roomUser.name);
                      }}
                      className="text-purple-400 hover:text-purple-300 p-1"
                      title="عرض الملف الشخصي"
                    >
                      <User className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => startPrivateChat(roomUser.name)}
                      className="text-pink-400 hover:text-pink-300 p-1"
                      title="محادثة خاصة"
                    >
                      <MessageSquare className="w-3 h-3" />
                    </button>
                    {user.type === 'king' && (
                      <>
                        <button
                          onClick={() => muteUser(roomUser.name)}
                          className="text-orange-400 hover:text-orange-300 p-1"
                          title="كتم"
                        >
                          <Ban className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => promoteUser(roomUser.name, 'vip')}
                          className="text-purple-400 hover:text-purple-300 p-1"
                          title="ترقية"
                        >
                          <UserCheck className="w-3 h-3" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))
            ) : chatMode === 'private' ? (
              // عرض جميع المستخدمين للمحادثة الخاصة
              Object.values(onlineUsers).flat().map((roomUser, index) => (
                <div 
                  key={index} 
                  className={`flex items-center gap-2 p-2 rounded-lg transition-colors cursor-pointer hover:bg-white/5 ${
                    privateChatWith === roomUser.name ? 'bg-pink-500/20 border border-pink-400/30' : ''
                  }`}
                  onClick={() => startPrivateChat(roomUser.name)}
                >
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  <span className={`${getUserColor(roomUser.type)} flex-1`}>{roomUser.name}</span>
                  <span className="text-lg">{getGenderIcon(roomUser.gender)}</span>
                  {getUserIcon(roomUser.type)}
                  <MessageSquare className="w-4 h-4 text-pink-400" />
                </div>
              ))
            ) : (
              // عرض جميع المستخدمين مع أزرار عرض الملفات
              Object.values(onlineUsers).flat().map((roomUser, index) => (
                <div key={index} className="flex items-center gap-2 p-2 hover:bg-white/5 rounded-lg transition-colors group">
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  <span className={`${getUserColor(roomUser.type)} flex-1`}>{roomUser.name}</span>
                  <span className="text-lg">{getGenderIcon(roomUser.gender)}</span>
                  {getUserIcon(roomUser.type)}
                  <div className="opacity-0 group-hover:opacity-100 flex gap-1">
                    <button
                      onClick={() => {
                        setChatMode('profile');
                        setViewingProfile(roomUser.name);
                      }}
                      className="text-purple-400 hover:text-purple-300 p-1"
                      title="عرض الملف الشخصي"
                    >
                      <Eye className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
          
          {/* إعلان الدردشة الحرة */}
          <div className="mt-6 p-3 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-lg border border-green-400/30">
            <div className="text-center text-green-200 text-sm">
              🆓 دردشة حرة تماماً
              <div className="font-bold text-white text-xs mt-1">
                شارك الصور والأكواد بلا قيود!
              </div>
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="lg:col-span-3 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 flex flex-col">
          {/* عرض الملف الشخصي */}
          {chatMode === 'profile' && viewingProfile ? (
            renderProfile(viewingProfile)
          ) : (
            <>
              {/* Chat Header */}
              {chatMode === 'private' && privateChatWith && (
                <div className="p-4 border-b border-white/20 bg-pink-500/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-pink-400" />
                      <span className="text-white font-medium">محادثة خاصة مع {privateChatWith}</span>
                      <span className="text-lg">{getGenderIcon(Object.values(onlineUsers).flat().find(u => u.name === privateChatWith)?.gender || 'male')}</span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setChatMode('profile');
                          setViewingProfile(privateChatWith);
                        }}
                        className="text-purple-400 hover:text-purple-300"
                        title="عرض الملف الشخصي"
                      >
                        <User className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => {
                          setChatMode('public');
                          setPrivateChatWith(null);
                        }}
                        className="text-red-400 hover:text-red-300"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {getCurrentMessages().map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${msg.isSystem ? 'items-center' : 'items-start'}`}
                  >
                    {msg.isSystem ? (
                      <div className="bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 text-emerald-200 px-6 py-3 rounded-full text-sm border border-emerald-400/30 backdrop-blur-sm">
                        {msg.message}
                      </div>
                    ) : (
                      <div className="max-w-2xl">
                        <div className="flex items-center gap-2 mb-2">
                          <button
                            onClick={() => {
                              setChatMode('profile');
                              setViewingProfile(msg.username);
                            }}
                            className={`font-semibold text-sm ${getUserColor(msg.userType)} hover:underline cursor-pointer`}
                          >
                            {msg.username}
                          </button>
                          <span className="text-lg">{getGenderIcon(Object.values(onlineUsers).flat().find(u => u.name === msg.username)?.gender || userProfiles[msg.username]?.gender || 'male')}</span>
                          {getUserIcon(msg.userType)}
                          <span className="text-xs text-gray-400">
                            {formatTime(msg.timestamp)}
                          </span>
                          {user.type === 'king' && msg.userType !== 'king' && chatMode === 'public' && (
                            <button
                              onClick={() => muteUser(msg.username)}
                              className="text-orange-400 hover:text-orange-300 ml-2"
                              title="كتم المستخدم"
                            >
                              <Ban className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                        {renderMessage(msg)}
                      </div>
                    )}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-white/20 bg-white/5">
                <div className="flex gap-2 mb-3">
                  <button
                    onClick={() => setShowImageUpload(true)}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-2 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg flex items-center gap-1"
                    title="إرسال صورة"
                  >
                    <Image className="w-4 h-4" />
                    <span className="text-xs">صورة</span>
                  </button>
                  
                  <button
                    onClick={() => setShowCodeEditor(true)}
                    className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-2 rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-300 shadow-lg flex items-center gap-1"
                    title="إرسال كود"
                  >
                    <Code className="w-4 h-4" />
                    <span className="text-xs">كود</span>
                  </button>

                  {user.type === 'king' && chatMode === 'public' && (
                    <button
                      onClick={() => setShowPrivateChat(true)}
                      className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white p-2 rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all duration-300 shadow-lg flex items-center gap-1"
                      title="رسالة ملكية"
                    >
                      <Crown className="w-4 h-4" />
                      <span className="text-xs">ملكية</span>
                    </button>
                  )}
                </div>

                <div className="flex gap-3">
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={`اكتب أي شيء تريده بحرية كاملة ${chatMode === 'private' && privateChatWith ? `لـ ${privateChatWith}` : `في غرفة ${currentRoom}`}...`}
                    className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-emerald-400 backdrop-blur-sm resize-none"
                    rows={2}
                    maxLength={2000}
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!newMessage.trim()}
                    className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 disabled:from-gray-600 disabled:to-gray-600 text-white p-3 rounded-xl transition-all duration-300 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105 self-end"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
                <div className="text-xs text-white/40 mt-2 text-center">
                  🆓 دردشة حرة بلا قيود - اكتب ما تشاء، شارك الصور والأكواد!
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Image Upload Modal */}
      {showImageUpload && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 max-w-sm w-full border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-6 text-center flex items-center justify-center gap-2">
              <Image className="w-6 h-6" />
              إرسال صورة
            </h2>
            
            <div className="space-y-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                ref={fileInputRef}
                className="hidden"
              />
              
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-4 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <Camera className="w-5 h-5" />
                اختيار صورة
              </button>

              <div className="text-xs text-white/60 text-center">
                يمكنك رفع أي صورة بأي حجم - لا توجد قيود!
              </div>

              <button
                onClick={() => setShowImageUpload(false)}
                className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 rounded-xl transition-colors"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Code Editor Modal */}
      {showCodeEditor && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 max-w-2xl w-full border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-6 text-center flex items-center justify-center gap-2">
              <Code className="w-6 h-6" />
              إرسال كود برمجي
            </h2>
            
            <div className="space-y-4">
              <select
                value={codeLanguage}
                onChange={(e) => setCodeLanguage(e.target.value)}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
              >
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="html">HTML</option>
                <option value="css">CSS</option>
                <option value="php">PHP</option>
                <option value="java">Java</option>
                <option value="cpp">C++</option>
                <option value="csharp">C#</option>
                <option value="sql">SQL</option>
                <option value="bash">Bash</option>
              </select>
              
              <textarea
                value={codeContent}
                onChange={(e) => setCodeContent(e.target.value)}
                placeholder="اكتب الكود هنا... لا توجد قيود على المحتوى!"
                className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-xl text-green-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 font-mono text-sm"
                rows={12}
                style={{ direction: 'ltr', textAlign: 'left' }}
              />

              <div className="text-xs text-white/60">
                شارك أي كود تريده - JavaScript, Python, HTML, أو أي لغة أخرى!
              </div>

              <div className="flex gap-3">
                <button
                  onClick={sendCode}
                  disabled={!codeContent.trim()}
                  className="flex-1 bg-purple-500 hover:bg-purple-600 disabled:bg-gray-600 text-white font-semibold py-3 rounded-xl transition-colors"
                >
                  إرسال الكود
                </button>
                <button
                  onClick={() => {
                    setShowCodeEditor(false);
                    setCodeContent('');
                  }}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 rounded-xl transition-colors"
                >
                  إلغاء
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Admin Panel Modal */}
      {showAdminPanel && user.type === 'king' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 max-w-2xl w-full border border-white/20 max-h-96 overflow-y-auto">
            <h2 className="text-2xl font-bold text-yellow-400 mb-6 text-center flex items-center justify-center gap-2">
              <Crown className="w-6 h-6" />
              لوحة تحكم الملك
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* إحصائيات المجتمع */}
              <div className="bg-white/5 rounded-lg p-4">
                <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  إحصائيات المجتمع
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-300">إجمالي المستخدمين:</span>
                    <span className="text-emerald-400">{Object.values(onlineUsers).flat().length + 1}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">الملفات الشخصية:</span>
                    <span className="text-cyan-400">{Object.keys(userProfiles).length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">إجمالي المنشورات:</span>
                    <span className="text-purple-400">
                      {Object.values(userProfiles).reduce((total, profile) => total + (profile.posts?.length || 0), 0)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">إجمالي المتابعات:</span>
                    <span className="text-pink-400">
                      {Object.values(userProfiles).reduce((total, profile) => total + (profile.followers?.length || 0), 0)}
                    </span>
                  </div>
                </div>
              </div>

              {/* المستخدمون المكتومون */}
              <div className="bg-white/5 rounded-lg p-4">
                <h3 className="text-white font-semibold mb-3">المستخدمون المكتومون:</h3>
                {mutedUsers.length > 0 ? (
                  <div className="space-y-2">
                    {mutedUsers.map(mutedUser => (
                      <div key={mutedUser} className="flex items-center justify-between bg-orange-500/20 p-2 rounded">
                        <span className="text-orange-200">{mutedUser}</span>
                        <button
                          onClick={() => unmuteUser(mutedUser)}
                          className="text-green-400 hover:text-green-300 text-sm"
                        >
                          إلغاء الكتم
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-sm">لا يوجد مستخدمون مكتومون</p>
                )}
              </div>

              {/* إحصائيات الغرف */}
              <div className="bg-white/5 rounded-lg p-4">
                <h3 className="text-white font-semibold mb-3">إحصائيات الغرف:</h3>
                {rooms.map(room => (
                  <div key={room} className="flex items-center justify-between p-2">
                    <span className="text-white flex items-center gap-2">
                      {getRoomFlag(room)} {room}
                    </span>
                    <span className="text-emerald-400">
                      {(onlineUsers[room]?.length || 0) + (currentRoom === room ? 1 : 0)} متصل
                    </span>
                  </div>
                ))}
              </div>

              {/* أحدث الأنشطة */}
              <div className="bg-white/5 rounded-lg p-4">
                <h3 className="text-white font-semibold mb-3">المستخدمون النشطون:</h3>
                <div className="space-y-2">
                  {Object.entries(userProfiles)
                    .sort((a, b) => (b[1].posts?.length || 0) - (a[1].posts?.length || 0))
                    .slice(0, 5)
                    .map(([username, profile]) => (
                    <div key={username} className="flex items-center justify-between text-sm">
                      <span className={getUserColor(profile.type)}>{username}</span>
                      <span className="text-gray-400">{profile.posts?.length || 0} منشور</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowAdminPanel(false)}
              className="w-full mt-6 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              إغلاق
            </button>
          </div>
        </div>
      )}

      {/* King Private Message Modal */}
      {showPrivateChat && user.type === 'king' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 max-w-sm w-full border border-white/20">
            <h2 className="text-2xl font-bold text-yellow-400 mb-6 text-center flex items-center justify-center gap-2">
              <Crown className="w-6 h-6" />
              رسالة ملكية عامة
            </h2>
            
            <div className="space-y-4">
              <input
                type="text"
                placeholder="اسم المستخدم المستهدف (اختياري)"
                value={privateTarget}
                onChange={(e) => setPrivateTarget(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
              
              <textarea
                placeholder="اكتب رسالتك الملكية هنا... بلا قيود!"
                value={privateMessage}
                onChange={(e) => setPrivateMessage(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-yellow-400 h-24 resize-none"
                maxLength={500}
              />

              <div className="flex gap-3">
                <button
                  onClick={sendPrivateMessage}
                  disabled={!privateMessage.trim()}
                  className="flex-1 bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-600 text-white font-semibold py-3 rounded-xl transition-colors"
                >
                  إرسال
                </button>
                <button
                  onClick={() => setShowPrivateChat(false)}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 rounded-xl transition-colors"
                >
                  إلغاء
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KhatroAqrabChat;

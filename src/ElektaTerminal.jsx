import { useState, useMemo, useEffect, useRef, useCallback, memo } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
} from "firebase/auth";
import { auth } from "./firebase.js";
import {
  LayoutDashboard,
  Briefcase,
  Map,
  FileText,
  Settings,
  Bell,
  Search,
  Calendar,
  ChevronDown,
  Download,
  MoreHorizontal,
  Eye,
  Check,
  Clock,
  Trash2,
  X,
  MapPin,
  Sparkles,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  Layers,
  Zap,
  Command,
  Globe,
  Building2,
  TreePine,
  AlertTriangle,
  Target,
  FileBarChart,
  User,
  Shield,
  Database,
  Wifi,
  Scale,
  Printer,
  CornerDownLeft,
  Hash,
  Pencil,
  Plus,
  FileUp,
  LogOut,
} from "lucide-react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  ReferenceArea,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LabelList,
  AreaChart,
  Area,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";

/* ══════════════════════════════════════════════════════════════════
   DATASET & DERIVED CONSTANTS
   ══════════════════════════════════════════════════════════════════ */
export const RAW = [
  { a: "Via Giovanni Spadolini, 9 (Lotto A), 20141 Milano MI", t: "Terreno", c: 1230000, r: 103.5, lat: 45.4503, lng: 9.1957 },
  { a: "Via Giovanni Spadolini, 9 (Lotto B), 20141 Milano MI", t: "Terreno", c: 350000, r: 97.2, lat: 45.4501, lng: 9.1959 },
  { a: "P.za S. Carlo, 1, 10121 Torino TO", t: "Stabili", c: 380000, r: 70.1, lat: 45.0676, lng: 7.6849 },
  { a: "Viale Paolo Onorato Vigliani, 13, 20148 Milano MI", t: "Stabili", c: 450000, r: 49.4, lat: 45.4612, lng: 9.1509 },
  { a: "Viale Monte Santo, 10, 20124 Milano MI", t: "Stabili", c: 1299000, r: 46.4, lat: 45.4757, lng: 9.1944 },
  { a: "Via Filippo Corridoni, 2, 16145 Genova GE", t: "Stabili", c: 245000, r: 42.9, lat: 44.4007, lng: 8.9384 },
  { a: "C.so di Porta Nuova, 10, 20121 Milano MI", t: "Stabili", c: 1269000, r: 42.4, lat: 45.4730, lng: 9.1908 },
  { a: "Via Legnano, 8, 20121 Milano MI", t: "Stabili", c: 1190000, r: 41.0, lat: 45.4721, lng: 9.1839 },
  { a: "Via Francesco Dassori, 10, 16145 Genova GE", t: "Stabili", c: 255000, r: 40.6, lat: 44.4001, lng: 8.9376 },
  { a: "Via Palmanova, 12, 20132 Milano MI", t: "Terreno", c: 1300000, r: 40.0, lat: 45.4854, lng: 9.2358 },
  { a: "Via Pietro da Cemmo, 4, 20155 Milano MI", t: "Stabili", c: 160000, r: 39.5, lat: 45.4879, lng: 9.1589 },
  { a: "Via Giovanni Labus, 1, 20147 Milano MI", t: "Terreno", c: 5300000, r: 39.0, lat: 45.4530, lng: 9.1468 },
  { a: "Corso Sicilia, 10, 10133 Torino TO", t: "Stabili", c: 1000000, r: 38.6, lat: 45.0456, lng: 7.7032 },
  { a: "Via S. Francesco da Paola, 44, 10123 Torino TO", t: "Stabili", c: 450000, r: 37.4, lat: 45.0706, lng: 7.6934 },
  { a: "Via S. Rocco, 9, 10133 Torino TO", t: "Stabili", c: 120000, r: 34.9, lat: 45.0449, lng: 7.7059 },
  { a: "Via Quintosole, 10, 20141 Milano MI", t: "Stabili", c: 450000, r: 34.4, lat: 45.4180, lng: 9.1882 },
  { a: "Via Antonio Stoppani, 6, 20129 Milano MI", t: "Stabili", c: 730000, r: 30.6, lat: 45.4656, lng: 9.2125 },
  { a: "P.za Corvetto, 3, 16122 Genova GE", t: "Stabili", c: 275000, r: 28.4, lat: 44.4111, lng: 8.9356 },
  { a: "Via Val della Torre, 50, 10149 Torino TO", t: "Stabili", c: 120000, r: 28.4, lat: 45.0786, lng: 7.6479 },
  { a: "Via S. Francesco da Paola, Via Roma, Torino TO", t: "Stabili", c: 498000, r: 27.6, lat: 45.0704, lng: 7.6845 },
  { a: "Salita Inferiore di Sant'Anna, 10, 16124 Genova GE", t: "Stabili", c: 270000, r: 26.5, lat: 44.4130, lng: 8.9306 },
  { a: "Via Filippo Turati, 10, 16123 Genova GE", t: "Stabili", c: 160000, r: 23.1, lat: 44.4105, lng: 8.9378 },
  { a: "Via Nicolò Tartaglia, 9, 20154 Milano MI", t: "Stabili", c: 636500, r: 21.9, lat: 45.4649, lng: 9.1725 },
  { a: "Salita di Santa Brigida, 29, 16126 Genova GE", t: "Stabili", c: 179000, r: 21.7, lat: 44.4086, lng: 8.9310 },
  { a: "Via Privata Riccardo Galli, 5, 20148 Milano MI", t: "Stabili", c: 546250, r: 21.7, lat: 45.4622, lng: 9.1523 },
  { a: "Via Provinciale, 26, 22041 Gironico Al Piano CO", t: "Terreno", c: 400000, r: 21.2, lat: 45.8300, lng: 9.0560 },
  { a: "P.za S. Carlo, 3, 10121 Torino TO", t: "Stabili", c: 380000, r: 21.0, lat: 45.0677, lng: 7.6853 },
  { a: "Via Portici S. Pietro, 16, 22019 Tremezzo CO", t: "Stabili", c: 5000000, r: 20.8, lat: 45.9847, lng: 9.2199 },
  { a: "Via Alessandro Volta, 3, 10121 Torino TO", t: "Stabili", c: 650000, r: 20.8, lat: 45.0701, lng: 7.6837 },
  { a: "Via Vittor Pisani, 13, 20124 Milano MI", t: "Stabili", c: 5150000, r: 20.4, lat: 45.4815, lng: 9.2014 },
  { a: "Via Privata Paternò, 10, 20143 Milano MI", t: "Stabili", c: 264000, r: 20.2, lat: 45.4476, lng: 9.1847 },
  { a: "Corso Como, 10, 20154 Milano MI", t: "Stabili", c: 778500, r: 20.2, lat: 45.4811, lng: 9.1869 },
  { a: "Via Andrea Palladio, 6, 10131 Torino TO", t: "Stabili", c: 576000, r: 19.4, lat: 45.0551, lng: 7.7198 },
  { a: "Via San Nicolao, 10, 20123 Milano MI", t: "Stabili", c: 2904000, r: 19.3, lat: 45.4648, lng: 9.1808 },
  { a: "V.le Beatrice d'Este, 1, 20122 Milano MI", t: "Stabili", c: 900000, r: 19.0, lat: 45.4554, lng: 9.1963 },
  { a: "Via Fabrizio Clerici, 12, Genzano di Roma RM", t: "Stabili", c: 1200000, r: 18.9, lat: 41.7007, lng: 12.6936 },
  { a: "Via G. L. Lagrange, 45, 10123 Torino TO", t: "Stabili", c: 392000, r: 18.5, lat: 45.0704, lng: 7.6757 },
  { a: "Via Euripide, 9, 20145 Milano MI", t: "Stabili", c: 2320000, r: 18.4, lat: 45.4680, lng: 9.1654 },
  { a: "Piazza Duca d'Aosta, 12, 20124 Milano MI", t: "Stabili", c: 1140000, r: 18.1, lat: 45.4839, lng: 9.2024 },
  { a: "Via Federico Engels, 9, 20153 Milano MI", t: "Stabili", c: 289000, r: 18.1, lat: 45.4535, lng: 9.1431 },
  { a: "Via Giulio e Corrado Venini, 42, 20127 Milano MI", t: "Stabili", c: 2160000, r: 18.0, lat: 45.4936, lng: 9.2117 },
  { a: "Via Privata del Don, 6, 20123 Milano MI", t: "Stabili", c: 1190000, r: 17.8, lat: 45.4630, lng: 9.1880 },
  { a: "Via Luigi Galvani, 19, 20124 Milano MI", t: "Stabili", c: 603000, r: 17.7, lat: 45.4795, lng: 9.2006 },
  { a: "Via Pietro Mascagni, 22b, 20122 Milano MI", t: "Stabili", c: 2385000, r: 17.6, lat: 45.4599, lng: 9.2138 },
  { a: "Viale Emilio Caldara, 15, 20122 Milano MI", t: "Stabili", c: 680000, r: 17.6, lat: 45.4562, lng: 9.2007 },
  { a: "Via Santa Chiara, 10, 16128 Genova GE", t: "Stabili", c: 365000, r: 17.2, lat: 44.4044, lng: 8.9448 },
  { a: "V. Cavour, 10, 10123 Torino TO", t: "Stabili", c: 550800, r: 17.1, lat: 45.0694, lng: 7.6898 },
  { a: "Via Maestri Campionesi, 10, 20135 Milano MI", t: "Stabili", c: 786000, r: 16.4, lat: 45.4513, lng: 9.2010 },
  { a: "Via Ennio, 9, 20137 Milano MI", t: "Stabili", c: 640000, r: 16.1, lat: 45.4563, lng: 9.2215 },
  { a: "Via Felice Casati, 12, 20124 Milano MI", t: "Stabili", c: 872000, r: 15.6, lat: 45.4780, lng: 9.2010 },
  { a: "Piazza Galeazzo Alessi, 1, 16128 Genova GE", t: "Stabili", c: 375000, r: 15.0, lat: 44.4053, lng: 8.9449 },
  { a: "Via Nino Bixio, 10, 16128 Genova GE", t: "Stabili", c: 420000, r: 14.9, lat: 44.4038, lng: 8.9482 },
  { a: "Via Pietro Mascagni, 22c, 20122 Milano MI", t: "Stabili", c: 2120000, r: 14.9, lat: 45.4597, lng: 9.2140 },
  { a: "Via Carlo Alberto, 10, 10123 Torino TO", t: "Stabili", c: 850000, r: 14.3, lat: 45.0693, lng: 7.6862 },
  { a: "Via Melchiorre Gioia, 141, 20125 Milano MI", t: "Stabili", c: 550000, r: 13.9, lat: 45.4903, lng: 9.2022 },
  { a: "Via Ippolito Nievo, 10, 20145 Milano MI", t: "Stabili", c: 715000, r: 13.6, lat: 45.4693, lng: 9.1623 },
  { a: "Via Raffaello Sanzio, 28, Novate Milanese MI", t: "Stabili", c: 250000, r: 13.5, lat: 45.5303, lng: 9.1528 },
  { a: "Via Pietro Mascagni, 22, 20122 Milano MI", t: "Stabili", c: 2385000, r: 13.2, lat: 45.4601, lng: 9.2135 },
  { a: "Corso Giacomo Matteotti, 10, 10121 Torino TO", t: "Stabili", c: 272000, r: 12.7, lat: 45.0658, lng: 7.6836 },
  { a: "Via Bramante, 20, 20154 Milano MI", t: "Stabili", c: 940000, r: 12.4, lat: 45.4817, lng: 9.1823 },
  { a: "Via Trento, 10, 16145 Genova GE", t: "Stabili", c: 380000, r: 12.3, lat: 44.4009, lng: 8.9350 },
  { a: "Piazza della Repubblica, 30, 20124 Milano MI", t: "Stabili", c: 2000000, r: 12.3, lat: 45.4797, lng: 9.1961 },
  { a: "Via Numa Pompilio, 4, 20123 Milano MI", t: "Stabili", c: 975000, r: 11.2, lat: 45.4630, lng: 9.1820 },
  { a: "Via Luigi Canonica, 10, 20154 Milano MI", t: "Stabili", c: 1560000, r: 10.8, lat: 45.4764, lng: 9.1802 },
  { a: "Via Panfilo Castaldi, 33, 20124 Milano MI", t: "Stabili", c: 800000, r: 10.7, lat: 45.4756, lng: 9.2040 },
  { a: "Via Emanuele Filiberto, 4, 20149 Milano MI", t: "Stabili", c: 1050000, r: 10.2, lat: 45.4679, lng: 9.1538 },
  { a: "Salita Inf. di Sant'Anna, 16, 16125 Genova GE", t: "Stabili", c: 385000, r: 9.6, lat: 44.4132, lng: 8.9304 },
  { a: "Str. Tetti Bertoglio, 137, 10132 Torino TO", t: "Stabili", c: 179000, r: 9.3, lat: 45.0357, lng: 7.7203 },
  { a: "Via Lodovico Settala, 11, 20124 Milano MI", t: "Stabili", c: 830000, r: 9.3, lat: 45.4747, lng: 9.2022 },
  { a: "Via Giordano Bruno, 10, 16146 Genova GE", t: "Stabili", c: 420000, r: 8.6, lat: 44.4170, lng: 8.8640 },
  { a: "Piazzale Lagosta, 4, 20124 Milano MI", t: "Stabili", c: 880000, r: 8.4, lat: 45.4856, lng: 9.2096 },
  { a: "Via Bartolomeo Eustachi, 21, 20129 Milano MI", t: "Stabili", c: 799000, r: 8.4, lat: 45.4660, lng: 9.2133 },
  { a: "Viale Montello, 20, 20154 Milano MI", t: "Stabili", c: 1580000, r: 8.0, lat: 45.4822, lng: 9.1750 },
  { a: "V. Giambattista Bogino, 25, 10123 Torino TO", t: "Stabili", c: 880000, r: 7.3, lat: 45.0690, lng: 7.6896 },
  { a: "Lungo Dora Pietro Colletta, 147, Torino TO", t: "Stabili", c: 270000, r: 7.2, lat: 45.0846, lng: 7.7085 },
  { a: "Via di Santa Zita, 10, 16129 Genova GE", t: "Stabili", c: 305000, r: 6.8, lat: 44.4087, lng: 8.9484 },
  { a: "Via Fontana, 16, 20122 Milano MI", t: "Stabili", c: 950000, r: 6.6, lat: 45.4614, lng: 9.2030 },
  { a: "Via Ronchi, 35, 16155 Genova GE", t: "Stabili", c: 198000, r: 6.3, lat: 44.4264, lng: 8.8438 },
  { a: "Corso Giacomo Matteotti, 3, 10121 Torino TO", t: "Stabili", c: 840000, r: 6.1, lat: 45.0660, lng: 7.6834 },
  { a: "Via della Moscova, 10, 20121 Milano MI", t: "Stabili", c: 1180000, r: 6.0, lat: 45.4737, lng: 9.1892 },
  { a: "Via Valsesia, 66, 20152 Milano MI", t: "Stabili", c: 320000, r: 5.7, lat: 45.4533, lng: 9.1337 },
  { a: "Piazzale Francesco Baracca, 10, 20123 Milano MI", t: "Stabili", c: 1750000, r: 5.5, lat: 45.4679, lng: 9.1749 },
  { a: "Via Rivoli, 10, 16128 Genova GE", t: "Stabili", c: 425000, r: 5.4, lat: 44.4055, lng: 8.9459 },
  { a: "Via G. B. Pergolesi, 10, 20124 Milano MI", t: "Stabili", c: 1180000, r: 5.3, lat: 45.4779, lng: 9.1987 },
  { a: "Via Lodovico Muratori, 26, 20135 Milano MI", t: "Stabili", c: 1040000, r: 5.1, lat: 45.4509, lng: 9.2053 },
  { a: "Via Giovanni Cagliero, 7, 20125 Milano MI", t: "Stabili", c: 749000, r: 5.1, lat: 45.4899, lng: 9.1985 },
  { a: "Via Lecco, 22, 20124 Milano MI", t: "Stabili", c: 860000, r: 5.1, lat: 45.4786, lng: 9.2011 },
  { a: "Viale Vittorio Veneto, 6, 20124 Milano MI", t: "Stabili", c: 815000, r: 4.9, lat: 45.4795, lng: 9.1995 },
  { a: "Via Palestro, 10, 16121 Genova GE", t: "Stabili", c: 255000, r: 4.8, lat: 44.4069, lng: 8.9421 },
  { a: "Corso Filippo Turati, 22, 10128 Torino TO", t: "Stabili", c: 295000, r: 4.8, lat: 45.0531, lng: 7.6724 },
  { a: "Corso Palestro, 10, 10122 Torino TO", t: "Stabili", c: 525000, r: 4.8, lat: 45.0650, lng: 7.6810 },
  { a: "Via G. B. Pergolesi, 6, 20124 Milano MI", t: "Stabili", c: 719000, r: 4.4, lat: 45.4777, lng: 9.1982 },
  { a: "C.so Galileo Ferraris, 122, 10129 Torino TO", t: "Stabili", c: 510000, r: 4.2, lat: 45.0558, lng: 7.6697 },
  { a: "Via Evangelista Torricelli, 13, 10129 Torino TO", t: "Stabili", c: 295000, r: 3.9, lat: 45.0556, lng: 7.6710 },
  { a: "Via Ettore Ponti, 30, 20143 Milano MI", t: "Stabili", c: 589000, r: 3.4, lat: 45.4471, lng: 9.1880 },
  { a: "Viale Monza, 43b, 20127 Milano MI", t: "Stabili", c: 650000, r: 3.4, lat: 45.4907, lng: 9.2196 },
  { a: "V. Archimede, 42, 20129 Milano MI", t: "Stabili", c: 960000, r: 3.2, lat: 45.4623, lng: 9.2186 },
  { a: "Via Ruggero Leoncavallo, 22, 20131 Milano MI", t: "Stabili", c: 529000, r: 3.1, lat: 45.4828, lng: 9.2422 },
  { a: "Corso Moncalieri, 211, 10133 Torino TO", t: "Stabili", c: 425000, r: 2.9, lat: 45.0377, lng: 7.7068 },
  { a: "Piazza Carlo Irnerio, 10, 20146 Milano MI", t: "Stabili", c: 775000, r: 2.8, lat: 45.4644, lng: 9.1553 },
  { a: "Via Argonne, 1, 16145 Genova GE", t: "Stabili", c: 890000, r: 2.4, lat: 44.3991, lng: 8.9393 },
  { a: "Via Annibale Grasselli, 19, 20137 Milano MI", t: "Stabili", c: 675000, r: 2.3, lat: 45.4555, lng: 9.2178 },
  { a: "Via Borgogna, 1, 20122 Milano MI", t: "Stabili", c: 2000000, r: 1.9, lat: 45.4630, lng: 9.1976 },
  { a: "C.so Francia, 35, 10138 Torino TO", t: "Stabili", c: 380000, r: 1.8, lat: 45.0905, lng: 7.6607 },
  { a: "Corso Regina Margherita, 10, 10153 Torino TO", t: "Stabili", c: 410000, r: 1.7, lat: 45.0836, lng: 7.6990 },
  { a: "Via Fratelli Carle, 30, 10129 Torino TO", t: "Stabili", c: 365000, r: -2.8, lat: 45.0605, lng: 7.6704 },
  { a: "Via Marco Cremosano, 6, 20148 Milano MI", t: "Stabili", c: 495000, r: -3.0, lat: 45.4614, lng: 9.1510 },
  { a: "Via Ercole Ferrario, 3, 20144 Milano MI", t: "Stabili", c: 960000, r: -4.7, lat: 45.4541, lng: 9.1762 },
  { a: "Via Antonio Canova, 35, 20145 Milano MI", t: "Stabili", c: 1380000, r: -7.8, lat: 45.4701, lng: 9.1620 },
  { a: "Via Imperiale, 10, 16143 Genova GE", t: "Stabili", c: 145000, r: -7.8, lat: 44.4269, lng: 8.9124 },
  { a: "Piazza Napoli, 10, 20100 Milano MI", t: "Stabili", c: 820000, r: -12.1, lat: 45.4528, lng: 9.1620 },
  { a: "Piazza Emilia, 10, 20129 Milano MI", t: "Stabili", c: 1050000, r: -12.8, lat: 45.4617, lng: 9.2190 },
  { a: "Corso Sempione, 10, 20154 Milano MI", t: "Stabili", c: 1440000, r: -12.8, lat: 45.4778, lng: 9.1726 },
  { a: "Via S. Marco, 30, 20121 Milano MI", t: "Stabili", c: 1500000, r: -12.8, lat: 45.4742, lng: 9.1883 },
  { a: "Via Luigi Rizzo, 112, 16156 Genova GE", t: "Stabili", c: 225000, r: -14.7, lat: 44.4290, lng: 8.8403 },
  { a: "Via Cristoforo Colombo, 21, 10129 Torino TO", t: "Stabili", c: 440000, r: -15.7, lat: 45.0562, lng: 7.6747 },
  { a: "Via Beato Angelico, 1, 20133 Milano MI", t: "Stabili", c: 990000, r: -15.7, lat: 45.4741, lng: 9.2333 },
  { a: "Salita delle Fieschine, 10, 16122 Genova GE", t: "Stabili", c: 340000, r: -16.3, lat: 44.4122, lng: 8.9337 },
  { a: "Viale Brianza, 12/A, 20127 Milano MI", t: "Stabili", c: 840000, r: -16.5, lat: 45.4918, lng: 9.2155 },
  { a: "Via Saluzzo, 89, 10126 Torino TO", t: "Stabili", c: 299000, r: -19.2, lat: 45.0504, lng: 7.6906 },
  { a: "Via Paolo Boselli, 10, 10146 Torino TO", t: "Stabili", c: 780000, r: -20.4, lat: 45.0793, lng: 7.6462 },
  { a: "S.da Val Salice, 125, 10131 Torino TO", t: "Stabili", c: 345000, r: -21.7, lat: 45.0461, lng: 7.7245 },
  { a: "Via Sansovino, 10, 20133 Milano MI", t: "Stabili", c: 889000, r: -21.7, lat: 45.4750, lng: 9.2318 },
  { a: "Corso Sardegna, 105, 16142 Genova GE", t: "Stabili", c: 189000, r: -23.0, lat: 44.4175, lng: 8.9695 },
  { a: "Via Achille Zezon, 5, 20124 Milano MI", t: "Stabili", c: 1590000, r: -23.5, lat: 45.4861, lng: 9.2086 },
  { a: "Via Canevari, 10, 16137 Genova GE", t: "Stabili", c: 135000, r: -24.1, lat: 44.4007, lng: 8.9711 },
  { a: "Via Filadelfia, 149, 10137 Torino TO", t: "Stabili", c: 330000, r: -24.5, lat: 45.0293, lng: 7.6865 },
  { a: "Lungoparco Gropallo, 4, 16122 Genova GE", t: "Stabili", c: 268000, r: -25.1, lat: 44.4097, lng: 8.9341 },
  { a: "Corso Lecce, 50, 10145 Torino TO", t: "Stabili", c: 348000, r: -25.4, lat: 45.0823, lng: 7.6417 },
  { a: "Via Carlo Pisacane, 10, 20129 Milano MI", t: "Stabili", c: 1990000, r: -25.7, lat: 45.4660, lng: 9.2170 },
  { a: "Via Losanna, 13, 20154 Milano MI", t: "Stabili", c: 1350000, r: -26.8, lat: 45.4779, lng: 9.1761 },
  { a: "Corso Sebastopoli, 204, 10136 Torino TO", t: "Stabili", c: 435000, r: -27.4, lat: 45.0270, lng: 7.6631 },
  { a: "Via Giovanni Acerbi, 10, 16148 Genova GE", t: "Stabili", c: 630000, r: -29.8, lat: 44.4037, lng: 8.9851 },
  { a: "Piazza Sempione, 4, 20154 Milano MI", t: "Stabili", c: 3900000, r: -32.4, lat: 45.4835, lng: 9.1703 },
  { a: "Via Emilio Salgari, 20, 16156 Genova GE", t: "Stabili", c: 310000, r: -33.8, lat: 44.4268, lng: 8.8395 },
  { a: "Via Sant'Ilario, 34, 16167 Genova GE", t: "Stabili", c: 850000, r: -35.7, lat: 44.4069, lng: 9.0027 },
  { a: "Via Bernardo de Canal, 62, 10137 Torino TO", t: "Stabili", c: 245000, r: -36.8, lat: 45.0298, lng: 7.6884 },
  { a: "Via Michele Coppino, 43, 10147 Torino TO", t: "Stabili", c: 185000, r: -39.4, lat: 45.0929, lng: 7.7193 },
  { a: "Via Carlo Canepa, 5, 16154 Genova GE", t: "Stabili", c: 259000, r: -41.1, lat: 44.4265, lng: 8.8479 },
  { a: "Via Edoardo Rubino, 77, 10137 Torino TO", t: "Stabili", c: 230000, r: -43.2, lat: 45.0310, lng: 7.6841 },
  { a: "Corso Italia, 30, 16145 Genova GE", t: "Stabili", c: 1870000, r: -61.2, lat: 44.3978, lng: 8.9520 },
];

export const cityOf = (a) =>
  a.includes("Milano") || a.includes("Milanese")
    ? "Milano"
    : a.includes("Torino")
      ? "Torino"
      : a.includes("Genova")
        ? "Genova"
        : a.includes("Roma") || a.includes("Genzano")
          ? "Roma"
          : a.includes(" CO")
            ? "Como"
            : "Altro";

export const statusOf = (r) =>
  r >= 20 ? "Approvato" : r >= 10 ? "Due Diligence" : r >= 0 ? "In Revisione" : "Scartato";

export const DATA = RAW.map((d, i) => ({ ...d, id: i, city: cityOf(d.a), status: statusOf(d.r) }));

export const eur = (n) =>
  n >= 1e6 ? "\u20AC" + (n / 1e6).toFixed(2) + "M" : "\u20AC" + Math.round(n / 1e3) + "K";

export const eurFull = (n) => "\u20AC" + Math.round(n).toLocaleString("it-IT");

export const TOTAL_CAP = DATA.reduce((s, d) => s + d.c, 0);

export const CITY_CAP = Object.entries(
  DATA.reduce((m, d) => ((m[d.city] = (m[d.city] || 0) + d.c), m), {})
)
  .map(([name, value]) => ({ name, value }))
  .sort((a, b) => b.value - a.value);

export const ALLOC = [
  { name: "Stabili", value: 828, color: "#6366f1", glow: "#818cf8" },
  { name: "Terreno", value: 8, color: "#3b82f6", glow: "#60a5fa" },
];

export const CITY_HUES = ["#1e293b", "#2563eb", "#4c1d95", "#3b82f6", "#7c3aed", "#a78bfa"];

export const SPARK = {
  cap: [318, 372, 428, 451, 489, 518, 547, 566].map((v) => ({ v })),
  roi: [12.1, 13.4, 15.8, 16.0, 17.1, 17.5, 17.8].map((v) => ({ v })),
  deals: [41, 48, 55, 59, 65, 70, 74].map((v) => ({ v })),
  count: [608, 679, 721, 768, 799, 821, 836].map((v) => ({ v })),
};

export const riskAxes = ({ r, c, city }) => {
  const base = city === "Milano" ? 70 : city === "Torino" ? 65 : city === "Genova" ? 55 : 50;
  return [
    {
      subject: "Location",
      A: Math.round(Math.min(95, base + (r > 15 ? 20 : r > 5 ? 10 : r < 0 ? -15 : 0))),
    },
    {
      subject: "Liquidità",
      A: Math.round(Math.max(5, Math.min(95, ((6e6 - c) / 5.9e6) * 100))),
    },
    { subject: "Rendimento", A: Math.round(Math.min(99, Math.max(5, 50 + r * 0.7))) },
    {
      subject: "Cantiere",
      A: r > 20 && c < 5e5 ? 85 : r > 20 ? 70 : r > 10 ? 60 : r > 0 ? 45 : 30,
    },
    {
      subject: "Mercato",
      A: Math.round(
        Math.min(
          95,
          Math.max(
            5,
            45 + (r > 0 ? r * 1.2 : r * 0.5) + (city === "Milano" ? 15 : city === "Torino" ? 10 : 5)
          )
        )
      ),
    },
  ];
};

export const riskGrade = ({ r, c }) => {
  let s = 50;
  if (r > 30) s += 35;
  else if (r > 15) s += 20;
  else if (r > 5) s += 8;
  else if (r < 0) s -= 30;
  if (c < 3e5) s += 15;
  else if (c < 8e5) s += 5;
  else if (c > 2e6) s -= 10;
  s = Math.max(5, Math.min(95, s));
  return s >= 80
    ? { label: "Basso Rischio", hex: "#2563eb", bg: "rgba(37,99,235,.09)" }
    : s >= 55
      ? { label: "Rischio Moderato", hex: "#7c3aed", bg: "rgba(124,58,237,.09)" }
      : s >= 35
        ? { label: "Rischio Elevato", hex: "#f472b6", bg: "rgba(244,114,182,.09)" }
        : { label: "Alto Rischio", hex: "#db2777", bg: "rgba(219,39,119,.09)" };
};

export const aiVerdict = ({ r }) =>
  r >= 50
    ? "Rendimento eccezionale. ROI +" +
      r.toFixed(1) +
      "%, supera di " +
      (r - 17.8).toFixed(0) +
      "pp la media. Priorità assoluta in comitato."
    : r >= 20
      ? "Opportunità Premium. ROI +" +
        r.toFixed(1) +
        "%, sopra la media (+17.8%). Raccomandato Due Diligence accelerata."
      : r >= 10
        ? "Deal in target. Rendimento +" +
          r.toFixed(1) +
          "% entro soglia. Verifica struttura finanziaria prima della delibera."
        : r >= 0
          ? "Rendimento marginale (+" +
            r.toFixed(1) +
            "%). Sotto soglia target. Rivalutabile previa rinegoziazione."
          : "ROI negativo (" +
            r.toFixed(1) +
            "%). Perdita attesa sul capitale. Sconsigliata salvo revisione del prezzo.";

export const MAP_CITIES = [
  { name: "Como", x: 158.6, y: 68.3 },
  { name: "Milano", x: 165.3, y: 86.6 },
  { name: "Torino", x: 69.4, y: 107.6 },
  { name: "Genova", x: 149.7, y: 143.0 },
  { name: "Roma", x: 376.3, y: 276.3 },
];

export const CITY_COORDS = {
  Milano: { lat: 45.4642, lng: 9.19 },
  Torino: { lat: 45.0703, lng: 7.6869 },
  Genova: { lat: 44.4056, lng: 8.9463 },
  Roma: { lat: 41.9028, lng: 12.4964 },
  Como: { lat: 45.808, lng: 9.0852 },
  Altro: { lat: 43.7, lng: 11.25 }, // Toscana come fallback per deal senza città
};

/* ══════════════════════════════════════════════════════════════════
   ASYNC DATA LOADING HOOK
   ══════════════════════════════════════════════════════════════════ */
let _appReady = false;
export function usePortfolioData() {
  const [loading, setLoading] = useState(!_appReady);
  useEffect(() => {
    if (_appReady) return;
    _appReady = true;
    setLoading(false);
  }, []);
  return { data: DATA, loading, error: null };
}

/* ══════════════════════════════════════════════════════════════════
   PERSISTENT DEALS HOOK
   ══════════════════════════════════════════════════════════════════ */
function usePersistentDeals() {
  const MANUAL_KEY = "elekta_manual_deals";
  const OVERRIDES_KEY = "elekta_overrides";

  const [manualDeals, setManualDeals] = useState(() => {
    try { return JSON.parse(localStorage.getItem(MANUAL_KEY) || "[]"); }
    catch { return []; }
  });

  const [overrides, setOverrides] = useState(() => {
    try { return JSON.parse(localStorage.getItem(OVERRIDES_KEY) || "{}"); }
    catch { return {}; }
  });

  const saveManual = useCallback((deals) => {
    setManualDeals(deals);
    try { localStorage.setItem(MANUAL_KEY, JSON.stringify(deals)); } catch {}
  }, []);

  const saveOverrides = useCallback((ov) => {
    setOverrides(ov);
    try { localStorage.setItem(OVERRIDES_KEY, JSON.stringify(ov)); } catch {}
  }, []);

  const addDeal = useCallback((fields) => {
    const d = {
      ...fields,
      c: Number(fields.c) || 0,
      r: Number(fields.r) || 0,
      id: "manual-" + Date.now(),
      source: "manual",
      city: cityOf(fields.a || ""),
      status: statusOf(Number(fields.r) || 0),
    };
    saveManual([...manualDeals, d]);
    return d;
  }, [manualDeals, saveManual]);

  const deleteDeal = useCallback((id) => {
    if (manualDeals.find((d) => d.id === id)) {
      saveManual(manualDeals.filter((d) => d.id !== id));
    }
    // hide non-manual deals via override
    saveOverrides({ ...overrides, [id]: { ...(overrides[id] || {}), hidden: true } });
  }, [manualDeals, overrides, saveManual, saveOverrides]);

  const updateDeal = useCallback((id, fields) => {
    saveManual(manualDeals.map((d) =>
      d.id === id
        ? { ...d, ...fields, c: Number(fields.c) || d.c, r: Number(fields.r) ?? d.r, city: cityOf(fields.a || d.a), status: statusOf(Number(fields.r) ?? d.r) }
        : d
    ));
  }, [manualDeals, saveManual]);

  const setStatus = useCallback((id, status) => {
    if (manualDeals.find((d) => d.id === id)) {
      saveManual(manualDeals.map((d) => d.id === id ? { ...d, status } : d));
    }
    saveOverrides({ ...overrides, [id]: { ...(overrides[id] || {}), status } });
  }, [manualDeals, overrides, saveManual, saveOverrides]);

  const allDeals = useMemo(() =>
    [...DATA, ...manualDeals]
      .filter((d) => !overrides[d.id]?.hidden)
      .map((d) => overrides[d.id] ? { ...d, ...overrides[d.id] } : d),
    [manualDeals, overrides]
  );

  return { manualDeals, allDeals, addDeal, deleteDeal, updateDeal, setStatus };
}

function useCountUp(target, duration = 600) {
  const [val, setVal] = useState(target);
  const prev = useRef(target);
  useEffect(() => {
    if (prev.current === target) return;
    const from = prev.current;
    prev.current = target;
    const t0 = performance.now();
    const step = (now) => {
      const p = Math.min((now - t0) / duration, 1);
      const ep = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(from + (target - from) * ep));
      if (p < 1) requestAnimationFrame(step);
      else setVal(target);
    };
    requestAnimationFrame(step);
  }, [target, duration]);
  return val;
}

/* ══════════════════════════════════════════════════════════════════
   FIREBASE AUTH HOOK + LOGIN SCREEN
   ══════════════════════════════════════════════════════════════════ */
function useFirebaseAuth() {
  const [user, setUser] = useState(undefined); // undefined = still loading
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u ?? null));
    return unsub;
  }, []);
  const signIn = (email, password) => signInWithEmailAndPassword(auth, email, password);
  const signUp = (email, password) => createUserWithEmailAndPassword(auth, email, password);
  const signOut = () => firebaseSignOut(auth);
  return { user, signIn, signUp, signOut };
}

const AUTH_ERRORS = {
  "auth/user-not-found": "Utente non trovato",
  "auth/wrong-password": "Password errata",
  "auth/invalid-credential": "Credenziali non valide",
  "auth/email-already-in-use": "Email già in uso",
  "auth/weak-password": "Password troppo corta (min. 6 caratteri)",
  "auth/invalid-email": "Indirizzo email non valido",
  "auth/too-many-requests": "Troppi tentativi. Riprova tra qualche minuto",
  "auth/operation-not-allowed": "Provider non abilitato — abilita Email/Password su Firebase Console",
  "auth/network-request-failed": "Errore di rete — controlla la connessione",
};

function LoginScreen({ signIn, signUp }) {
  const [mode, setMode] = useState("login"); // "login" | "register"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (mode === "login") await signIn(email, password);
      else await signUp(email, password);
    } catch (err) {
      setError(AUTH_ERRORS[err.code] || `${err.message || "Errore di autenticazione"} (${err.code ?? "sconosciuto"})`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center"
      style={{ fontFamily: "-apple-system,BlinkMacSystemFont,'SF Pro Display',Inter,sans-serif", background: "#f6f7fb" }}
    >
      <style>{GLOBAL_CSS}</style>
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute" style={{ top: -160, left: "16%", width: 620, height: 620, background: "radial-gradient(circle,rgba(99,102,241,.11),transparent 62%)" }} />
        <div className="absolute" style={{ top: "34%", right: -180, width: 560, height: 560, background: "radial-gradient(circle,rgba(16,185,129,.085),transparent 64%)" }} />
        <div className="absolute" style={{ bottom: -190, left: "42%", width: 520, height: 520, background: "radial-gradient(circle,rgba(139,92,246,.075),transparent 66%)" }} />
      </div>
      <div
        className="relative z-10 w-full overflow-hidden rounded-3xl border border-white/50 backdrop-blur-2xl"
        style={{
          maxWidth: 400,
          background: "linear-gradient(165deg,rgba(255,255,255,.88),rgba(255,255,255,.62))",
          boxShadow: "0 4px 12px rgba(15,23,42,.04), 0 20px 60px -16px rgba(99,102,241,.18), inset 0 1px 0 rgba(255,255,255,.9)",
          animation: "riseIn .7s cubic-bezier(.22,1,.36,1) forwards",
        }}
      >
        <div className="px-8 pb-8 pt-8">
          <div className="mb-7 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl" style={{ background: "linear-gradient(140deg,#6366f1,#8b5cf6)", boxShadow: "0 8px 22px -6px rgba(99,102,241,.7)" }}>
              <span className="font-black text-white" style={{ fontSize: 14 }}>E</span>
            </div>
            <div>
              <p className="font-black tracking-tight text-slate-800" style={{ fontSize: 15 }}>Investment Terminal</p>
              <p className="font-semibold text-slate-400" style={{ fontSize: 10.5 }}>{mode === "login" ? "Accedi al tuo account" : "Crea un nuovo account"}</p>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="mb-1.5 block font-bold uppercase tracking-[.18em] text-slate-400" style={{ fontSize: 9 }}>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="nome@azienda.it"
                className="w-full rounded-xl border border-slate-200/80 bg-white/70 px-3.5 py-2.5 text-slate-700 outline-none transition-all focus:border-indigo-300 focus:ring-2 focus:ring-indigo-500/20"
                style={{ fontSize: 13 }}
              />
            </div>
            <div>
              <label className="mb-1.5 block font-bold uppercase tracking-[.18em] text-slate-400" style={{ fontSize: 9 }}>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder={mode === "register" ? "Min. 6 caratteri" : "••••••••"}
                className="w-full rounded-xl border border-slate-200/80 bg-white/70 px-3.5 py-2.5 text-slate-700 outline-none transition-all focus:border-indigo-300 focus:ring-2 focus:ring-indigo-500/20"
                style={{ fontSize: 13 }}
              />
            </div>
            {error && (
              <div className="flex items-center gap-2 rounded-xl bg-rose-50 px-3.5 py-2.5">
                <AlertTriangle size={13} className="shrink-0 text-rose-500" />
                <p className="font-semibold text-rose-600" style={{ fontSize: 11 }}>{error}</p>
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-2xl py-3 font-bold text-white transition-all"
              style={{
                fontSize: 12.5,
                background: "linear-gradient(140deg,#6366f1,#7c3aed)",
                boxShadow: "0 8px 22px -8px rgba(99,102,241,.75), inset 0 1px 0 rgba(255,255,255,.22)",
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              ) : (
                <>{mode === "login" ? "Accedi" : "Crea account"}</>
              )}
            </button>
          </form>
          <div className="mt-4 text-center">
            <button
              onClick={() => { setMode((m) => m === "login" ? "register" : "login"); setError(null); }}
              className="font-semibold text-indigo-500 transition-colors hover:text-indigo-700"
              style={{ fontSize: 11 }}
            >
              {mode === "login" ? "Non hai un account? Registrati" : "Hai già un account? Accedi"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   SKELETON LOADING SCREEN
   ══════════════════════════════════════════════════════════════════ */
function SkeletonBlock({ className = "" }) {
  return (
    <div
      className={`animate-pulse rounded-2xl border border-white/50 bg-white/40 backdrop-blur-xl ${className}`}
    />
  );
}

function SkeletonScreen() {
  return (
    <div className="space-y-6 px-8 py-8">
      <div className="grid grid-cols-4 gap-5">
        {[0, 1, 2, 3].map((i) => (
          <SkeletonBlock key={i} className="h-36" />
        ))}
      </div>
      <div className="grid gap-5" style={{ gridTemplateColumns: "1.75fr 1fr 316px" }}>
        <SkeletonBlock className="h-96" />
        <SkeletonBlock className="h-96" />
        <SkeletonBlock className="h-96" />
      </div>
      <SkeletonBlock className="h-64" />
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   GLOBAL STYLES
   ══════════════════════════════════════════════════════════════════ */
const GLOBAL_CSS = `
@keyframes riseIn{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
@keyframes rowIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
@keyframes auroraShift{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}
@keyframes pulseGlow{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.7;transform:scale(1.12)}}
@keyframes ringPulse{0%{box-shadow:0 0 0 0 rgba(99,102,241,.5)}70%{box-shadow:0 0 0 10px rgba(99,102,241,0)}100%{box-shadow:0 0 0 0 rgba(99,102,241,0)}}
@keyframes blink{0%,100%{opacity:1}50%{opacity:.3}}
@keyframes fadeSlideIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeSlideOut{from{opacity:1;transform:translateY(0)}to{opacity:0;transform:translateY(-8px)}}
@keyframes paletteIn{from{opacity:0;transform:translateY(-8px) scale(.98)}to{opacity:1;transform:translateY(0) scale(1)}}
.scrollzone::-webkit-scrollbar{width:5px;height:5px}
.scrollzone::-webkit-scrollbar-thumb{background:rgba(148,163,184,.32);border-radius:9px}
.scrollzone::-webkit-scrollbar-track{background:transparent}
.view-enter{animation:fadeSlideIn .35s cubic-bezier(.22,1,.36,1) forwards}
.view-exit{animation:fadeSlideOut .2s ease forwards}
@media print{
  body *{visibility:hidden}
  #print-root,#print-root *{visibility:visible}
  #print-root{position:absolute;top:0;left:0;width:100%}
  .no-print{display:none!important}
}
`;

/* ATOMS */
const Eyebrow = ({ children, className = "" }) => (
  <p
    className={"font-bold uppercase tracking-[0.2em] text-slate-400 " + className}
    style={{ fontSize: 9 }}
  >
    {children}
  </p>
);

const GlassCard = ({ children, className = "", delay = 0, hover = false, ...props }) => {
  const [hv, setHv] = useState(false);
  return (
    <div
      onMouseEnter={hover ? () => setHv(true) : undefined}
      onMouseLeave={hover ? () => setHv(false) : undefined}
      className={"relative rounded-3xl border border-white/50 backdrop-blur-2xl " + className}
      style={{
        background: "linear-gradient(165deg,rgba(255,255,255,.72),rgba(255,255,255,.42))",
        boxShadow: hv
          ? "0 2px 4px rgba(15,23,42,.05), 0 8px 24px rgba(15,23,42,.06), 0 28px 60px -16px rgba(99,102,241,.18), inset 0 1px 0 rgba(255,255,255,.95)"
          : "0 1px 2px rgba(15,23,42,.04), 0 4px 12px rgba(15,23,42,.035), 0 16px 40px -12px rgba(99,102,241,.10), inset 0 1px 0 rgba(255,255,255,.9)",
        transform: hv ? "translateY(-3px)" : "translateY(0)",
        transition:
          "transform .45s cubic-bezier(.32,.72,0,1),box-shadow .45s cubic-bezier(.32,.72,0,1)",
        opacity: 0,
        animation: "riseIn .7s cubic-bezier(.22,1,.36,1) " + delay + "s forwards",
      }}
      {...props}
    >
      {children}
    </div>
  );
};

const TypeChip = ({ t }) => (
  <span
    className={
      "inline-flex items-center rounded-md font-bold tracking-wide " +
      (t === "Terreno"
        ? "bg-blue-500/10 text-blue-700 ring-1 ring-blue-500/20"
        : "bg-indigo-500/10 text-indigo-700 ring-1 ring-indigo-500/20")
    }
    style={{ fontSize: 9.5, padding: "2px 7px" }}
  >
    {t}
  </span>
);
const StatusChip = ({ s }) => {
  const cls = {
    Approvato: "bg-blue-500/10 text-blue-700 ring-blue-500/20",
    "Due Diligence": "bg-violet-500/10 text-violet-700 ring-violet-500/20",
    "In Revisione": "bg-fuchsia-400/10 text-fuchsia-600 ring-fuchsia-400/20",
    Scartato: "bg-pink-500/10 text-pink-700 ring-pink-500/20",
  }[s];
  return (
    <span
      className={"inline-flex items-center rounded-md font-bold tracking-wide ring-1 " + cls}
      style={{ fontSize: 9.5, padding: "2px 7px" }}
    >
      {s}
    </span>
  );
};
const RoiChip = ({ r }) => {
  const cls =
    r >= 20
      ? "bg-blue-500/12 text-blue-800 ring-blue-500/22"
      : r >= 10
        ? "bg-sky-500/11 text-sky-700 ring-sky-500/20"
        : r > 0
          ? "bg-indigo-500/10 text-indigo-700 ring-indigo-500/18"
          : "bg-pink-500/9 text-pink-700 ring-pink-500/18";
  return (
    <span
      className={"inline-flex items-center rounded-md font-black tabular-nums ring-1 " + cls}
      style={{ fontSize: 10, padding: "2px 7px", letterSpacing: "-.01em" }}
    >
      {r > 0 ? "+" : ""}
      {r.toFixed(1)}%
    </span>
  );
};

const Spark = memo(({ data, color, uid }) => (
  <div className="h-10" style={{ margin: "0 -6px" }}>
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: 4 }}>
        <defs>
          <linearGradient id={"sf-" + uid} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.26} />
            <stop offset="60%" stopColor={color} stopOpacity={0.07} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
          <filter id={"sg-" + uid} x="-30%" y="-60%" width="160%" height="240%">
            <feDropShadow dx="0" dy="1.5" stdDeviation="2" floodColor={color} floodOpacity="0.45" />
          </filter>
        </defs>
        <Area
          type="monotone"
          dataKey="v"
          stroke={color}
          strokeWidth={1.75}
          fill={"url(#sf-" + uid + ")"}
          dot={false}
          isAnimationActive={false}
          style={{ filter: "url(#sg-" + uid + ")" }}
        />
      </AreaChart>
    </ResponsiveContainer>
  </div>
));

const ScatterTip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  if (!d) return null;
  const hue = d.r > 10 ? "#2563eb" : d.r > 0 ? "#4f46e5" : "#db2777";
  return (
    <div
      className="bg-white/94 rounded-2xl border border-white/70 p-3.5 backdrop-blur-2xl"
      style={{ maxWidth: 250, boxShadow: "0 8px 32px rgba(15,23,42,.14)" }}
    >
      <p className="font-bold leading-snug text-slate-800" style={{ fontSize: 11 }}>
        {d.a.length > 48 ? d.a.slice(0, 48) + "…" : d.a}
      </p>
      <div className="mb-2.5 mt-2 flex items-center gap-1.5">
        <TypeChip t={d.t} />
        <span className="text-slate-400" style={{ fontSize: 9.5 }}>
          {d.city}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-3 border-t border-slate-200/60 pt-2.5">
        <div>
          <Eyebrow>Costo</Eyebrow>
          <p
            className="mt-0.5 font-black tabular-nums text-slate-800"
            style={{ fontSize: 13, letterSpacing: "-.02em" }}
          >
            {eur(d.c)}
          </p>
        </div>
        <div>
          <Eyebrow>ROI</Eyebrow>
          <p
            className="mt-0.5 font-black tabular-nums"
            style={{ fontSize: 13, color: hue, letterSpacing: "-.02em" }}
          >
            {d.r > 0 ? "+" : ""}
            {d.r.toFixed(1)}%
          </p>
        </div>
      </div>
    </div>
  );
};
const BarTip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="bg-white/94 rounded-2xl border border-white/70 p-3 backdrop-blur-2xl"
      style={{ boxShadow: "0 8px 32px rgba(15,23,42,.14)" }}
    >
      <p className="font-bold text-slate-700" style={{ fontSize: 11 }}>
        {label}
      </p>
      <p
        className="font-black tabular-nums text-indigo-600"
        style={{ fontSize: 15, letterSpacing: "-.02em" }}
      >
        {eur(payload[0].value)}
      </p>
      <p className="text-slate-400" style={{ fontSize: 9.5 }}>
        {((payload[0].value / TOTAL_CAP) * 100).toFixed(1)}% del portafoglio
      </p>
    </div>
  );
};

const Kpi = ({ label, value, detail, delta, color, spark, uid, index }) => {
  const [hv, setHv] = useState(false);
  return (
    <div
      onMouseEnter={() => setHv(true)}
      onMouseLeave={() => setHv(false)}
      className="relative overflow-hidden rounded-3xl border border-white/50 backdrop-blur-2xl"
      style={{
        background: "linear-gradient(160deg,rgba(255,255,255,.72),rgba(255,255,255,.42))",
        boxShadow: hv
          ? "0 2px 4px rgba(15,23,42,.05), 0 8px 24px rgba(15,23,42,.06), 0 28px 60px -16px rgba(99,102,241,.18), inset 0 1px 0 rgba(255,255,255,.95)"
          : "0 1px 2px rgba(15,23,42,.04), 0 4px 12px rgba(15,23,42,.035), 0 16px 40px -12px rgba(99,102,241,.10), inset 0 1px 0 rgba(255,255,255,.9)",
        transform: hv ? "translateY(-3px)" : "translateY(0)",
        transition:
          "transform .45s cubic-bezier(.32,.72,0,1),box-shadow .45s cubic-bezier(.32,.72,0,1)",
        opacity: 0,
        animation: "riseIn .7s cubic-bezier(.22,1,.36,1) " + (0.05 + index * 0.07) + "s forwards",
      }}
    >
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{ background: "linear-gradient(90deg,transparent," + color + "66,transparent)" }}
      />
      <div
        className="pointer-events-none absolute -right-10 -top-12 h-32 w-32 rounded-full"
        style={{
          background: "radial-gradient(circle," + color + "22,transparent 68%)",
          opacity: hv ? 1 : 0.55,
          transition: "opacity .5s ease",
        }}
      />
      <div className="relative px-5 pb-0 pt-5">
        <Eyebrow>{label}</Eyebrow>
        <p
          className="mt-2.5 font-black tabular-nums"
          style={{ fontSize: 30, color: color, letterSpacing: "-.045em", lineHeight: 1 }}
        >
          {value}
        </p>
        <p className="mt-1.5 text-slate-400" style={{ fontSize: 10 }}>
          {detail}
        </p>
        <span
          className="ring-blue-500/16 mt-2.5 inline-flex items-center gap-1 rounded-lg bg-blue-500/10 font-bold text-blue-700 ring-1"
          style={{ fontSize: 9.5, padding: "3px 7px" }}
        >
          <TrendingUp size={9} strokeWidth={2.5} />
          {delta}
        </span>
      </div>
      <Spark data={spark} color={color} uid={uid} />
    </div>
  );
};

const Gauge = ({ label, value, pct, hex, delay }) => (
  <div
    style={{
      opacity: 0,
      animation: "riseIn .55s cubic-bezier(.22,1,.36,1) " + delay + "s forwards",
    }}
  >
    <div className="mb-1.5 flex items-baseline justify-between">
      <Eyebrow>{label}</Eyebrow>
      <span
        className="font-black tabular-nums"
        style={{ fontSize: 14, color: hex, letterSpacing: "-.03em" }}
      >
        {value}
      </span>
    </div>
    <div className="h-1.5 overflow-hidden rounded-full bg-slate-200/40">
      <div
        className="h-full rounded-full"
        style={{
          width: Math.max(2, Math.min(100, pct)) + "%",
          background: "linear-gradient(90deg," + hex + "bb," + hex + ")",
          boxShadow: "0 0 8px " + hex + "66",
          transition: "width .9s cubic-bezier(.22,1,.36,1)",
        }}
      />
    </div>
  </div>
);

/* TOAST */
const Toast = ({ message, onDismiss }) => {
  useEffect(() => {
    const t = setTimeout(onDismiss, 3000);
    return () => clearTimeout(t);
  }, [onDismiss]);
  return (
    <div
      className="fixed bottom-6 right-6 z-[200] flex items-center gap-3 rounded-2xl border border-white/70 px-4 py-3 backdrop-blur-[40px] no-print"
      style={{
        background: "linear-gradient(135deg,rgba(255,255,255,.96),rgba(238,242,255,.93))",
        boxShadow: "0 16px 44px -12px rgba(99,102,241,.35), inset 0 1px 0 rgba(255,255,255,.9)",
        animation: "riseIn .35s cubic-bezier(.22,1,.36,1) forwards",
      }}
    >
      <span className="flex h-7 w-7 items-center justify-center rounded-xl" style={{ background: "linear-gradient(140deg,#6366f1,#7c3aed)" }}>
        <Check size={13} strokeWidth={2.5} className="text-white" />
      </span>
      <span className="font-semibold text-slate-700" style={{ fontSize: 12 }}>{message}</span>
      <button onClick={onDismiss} className="ml-1 text-slate-400 transition-colors hover:text-slate-600">
        <X size={13} strokeWidth={1.5} />
      </button>
    </div>
  );
};

/* NEW / EDIT DEAL DRAWER — slides from LEFT */
const NewDealDrawer = ({ isOpen, isClosing, onRequestClose, onExited, onSubmit, initialValues = null }) => {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ a: "", t: "Stabili", c: "", r: "", note: "" });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!isOpen || isClosing) return;
    setForm(initialValues
      ? { a: initialValues.a || "", t: initialValues.t || "Stabili", c: String(initialValues.c || ""), r: String(initialValues.r || ""), note: initialValues.note || "" }
      : { a: "", t: "Stabili", c: "", r: "", note: "" }
    );
    setErrors({});
    const id = requestAnimationFrame(() => setOpen(true));
    return () => cancelAnimationFrame(id);
  }, [isOpen, isClosing]);

  useEffect(() => { if (isClosing) setOpen(false); }, [isClosing]);

  useEffect(() => {
    const esc = (e) => e.key === "Escape" && onRequestClose();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [onRequestClose]);

  useEffect(() => {
    if (!isClosing) return;
    const t = setTimeout(() => onExited(), 650);
    return () => clearTimeout(t);
  }, [isClosing, onExited]);

  const validate = () => {
    const errs = {};
    if (!form.a.trim()) errs.a = "Indirizzo obbligatorio";
    const cv = Number(form.c);
    if (!form.c || isNaN(cv) || cv <= 0) errs.c = "Costo deve essere > 0";
    const rv = Number(form.r);
    if (form.r === "" || isNaN(rv)) errs.r = "ROI deve essere un numero";
    return errs;
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onSubmit({ a: form.a.trim(), t: form.t, c: Number(form.c), r: Number(form.r), note: form.note.trim() });
    onRequestClose();
  };

  if (!isOpen) return null;
  const isEdit = !!initialValues;

  return (
    <>
      <div
        onClick={onRequestClose}
        className="fixed inset-0 z-40 transition-all duration-500 no-print"
        style={{
          background: open ? "rgba(15,23,42,.28)" : "rgba(15,23,42,0)",
          backdropFilter: open ? "blur(6px) saturate(55%)" : "blur(0px)",
          pointerEvents: open ? "auto" : "none",
        }}
      />
      <aside
        className="fixed bottom-0 left-0 top-0 z-50 flex flex-col overflow-hidden border-r border-white/60 backdrop-blur-[40px] no-print"
        style={{
          width: 400,
          maxWidth: "94vw",
          background: "linear-gradient(175deg,rgba(255,255,255,.95),rgba(248,250,252,.92))",
          transform: open ? "translateX(0)" : "translateX(-100%)",
          transition: "transform .58s cubic-bezier(.22,1.02,.36,1)",
          boxShadow: "24px 0 80px -20px rgba(15,23,42,.28), 2px 0 12px rgba(15,23,42,.06)",
        }}
      >
        <div className="pointer-events-none absolute -left-16 -top-24 h-72 w-72 rounded-full" style={{ background: "radial-gradient(circle,rgba(99,102,241,.14),transparent 66%)" }} />
        <div className="relative shrink-0 border-b border-slate-200/50 px-6 pb-4 pt-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <span className="h-3.5 w-1 rounded-full" style={{ background: "linear-gradient(180deg,#6366f1,#8b5cf6)" }} />
              <Eyebrow>Portfolio Manager</Eyebrow>
            </div>
            <button onClick={onRequestClose} className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200/70 bg-white/60 text-slate-500 transition-all duration-200 hover:rotate-90 hover:bg-slate-100">
              <X size={15} strokeWidth={1.5} />
            </button>
          </div>
          <h2 className="mt-3 font-black text-slate-800" style={{ fontSize: 16, letterSpacing: "-.035em" }}>
            {isEdit ? "Modifica Pratica" : "Nuova Pratica"}
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="scrollzone flex-1 overflow-y-auto px-6 py-5">
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block font-bold uppercase tracking-[.18em] text-slate-400" style={{ fontSize: 9 }}>Indirizzo *</label>
              <input
                value={form.a}
                onChange={(e) => setForm((f) => ({ ...f, a: e.target.value }))}
                placeholder="Via Roma, 1, 20121 Milano MI"
                className="w-full rounded-xl border px-3.5 py-2.5 text-slate-700 outline-none transition-all"
                style={{ fontSize: 12, borderColor: errors.a ? "#f43f5e" : "rgba(226,232,240,.8)", background: "rgba(255,255,255,.7)", boxShadow: errors.a ? "0 0 0 2px rgba(244,63,94,.15)" : "none" }}
              />
              {errors.a && <p className="mt-1 font-semibold text-rose-500" style={{ fontSize: 10 }}>{errors.a}</p>}
            </div>
            <div>
              <label className="mb-1.5 block font-bold uppercase tracking-[.18em] text-slate-400" style={{ fontSize: 9 }}>Tipo Asset</label>
              <select
                value={form.t}
                onChange={(e) => setForm((f) => ({ ...f, t: e.target.value }))}
                className="w-full rounded-xl border border-slate-200/80 bg-white/70 px-3.5 py-2.5 text-slate-700 outline-none"
                style={{ fontSize: 12 }}
              >
                <option>Stabili</option>
                <option>Terreno</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block font-bold uppercase tracking-[.18em] text-slate-400" style={{ fontSize: 9 }}>Costo (€) *</label>
                <input
                  type="number"
                  value={form.c}
                  onChange={(e) => setForm((f) => ({ ...f, c: e.target.value }))}
                  placeholder="500000"
                  min="1"
                  className="w-full rounded-xl border px-3.5 py-2.5 text-slate-700 outline-none transition-all"
                  style={{ fontSize: 12, borderColor: errors.c ? "#f43f5e" : "rgba(226,232,240,.8)", background: "rgba(255,255,255,.7)", boxShadow: errors.c ? "0 0 0 2px rgba(244,63,94,.15)" : "none" }}
                />
                {errors.c && <p className="mt-1 font-semibold text-rose-500" style={{ fontSize: 10 }}>{errors.c}</p>}
              </div>
              <div>
                <label className="mb-1.5 block font-bold uppercase tracking-[.18em] text-slate-400" style={{ fontSize: 9 }}>ROI (%) *</label>
                <input
                  type="number"
                  step="0.1"
                  value={form.r}
                  onChange={(e) => setForm((f) => ({ ...f, r: e.target.value }))}
                  placeholder="15.5"
                  className="w-full rounded-xl border px-3.5 py-2.5 text-slate-700 outline-none transition-all"
                  style={{ fontSize: 12, borderColor: errors.r ? "#f43f5e" : "rgba(226,232,240,.8)", background: "rgba(255,255,255,.7)", boxShadow: errors.r ? "0 0 0 2px rgba(244,63,94,.15)" : "none" }}
                />
                {errors.r && <p className="mt-1 font-semibold text-rose-500" style={{ fontSize: 10 }}>{errors.r}</p>}
              </div>
            </div>
            <div>
              <label className="mb-1.5 block font-bold uppercase tracking-[.18em] text-slate-400" style={{ fontSize: 9 }}>Note (opzionale)</label>
              <textarea
                value={form.note}
                onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
                placeholder="Osservazioni, contatti, riferimenti…"
                rows={3}
                className="w-full resize-none rounded-xl border border-slate-200/80 bg-white/70 px-3.5 py-2.5 text-slate-700 outline-none"
                style={{ fontSize: 12 }}
              />
            </div>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={onRequestClose}
              className="rounded-2xl border border-slate-200/80 bg-white/65 py-3 font-bold text-slate-600 transition-all hover:-translate-y-0.5 hover:bg-slate-50"
              style={{ fontSize: 11.5 }}
            >
              Annulla
            </button>
            <button
              type="submit"
              className="flex items-center justify-center gap-2 rounded-2xl py-3 font-bold text-white transition-transform hover:-translate-y-0.5 active:translate-y-0"
              style={{ fontSize: 11.5, background: "linear-gradient(140deg,#6366f1,#7c3aed)", boxShadow: "0 8px 22px -8px rgba(99,102,241,.75), inset 0 1px 0 rgba(255,255,255,.22)" }}
            >
              {isEdit ? <Pencil size={14} strokeWidth={2} /> : <Plus size={14} strokeWidth={2} />}
              {isEdit ? "Salva Modifiche" : "Aggiungi Pratica"}
            </button>
          </div>
          {isEdit && !initialValues && (
            <p className="mt-8 text-center font-semibold text-slate-400" style={{ fontSize: 10 }}>Nessuna pratica aggiunta manualmente</p>
          )}
        </form>
      </aside>
    </>
  );
};

/* NOTIFICATION BELL — last 3 manually added deals */
const NotificationBell = ({ manualDeals }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler, true);
    return () => document.removeEventListener("mousedown", handler, true);
  }, [open]);
  const recent = [...manualDeals].reverse().slice(0, 3);
  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative flex h-10 w-10 items-center justify-center rounded-2xl text-slate-400 transition-all duration-200 hover:bg-slate-100/80 hover:text-slate-600"
      >
        <Bell size={16} strokeWidth={1.5} />
        {recent.length > 0 && (
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-indigo-500" style={{ boxShadow: "0 0 6px #6366f1" }} />
        )}
      </button>
      {open && (
        <div
          className="absolute bottom-12 left-1/2 z-[300] w-64 -translate-x-1/2 overflow-hidden rounded-2xl border border-white/70 backdrop-blur-[40px]"
          style={{ background: "rgba(255,255,255,.96)", boxShadow: "0 16px 44px -12px rgba(15,23,42,.3), inset 0 1px 0 rgba(255,255,255,.9)" }}
        >
          <div className="border-b border-slate-200/50 px-4 py-2.5">
            <p className="font-bold uppercase tracking-[.18em] text-slate-400" style={{ fontSize: 9 }}>Pratiche aggiunte</p>
          </div>
          {recent.length === 0 ? (
            <div className="px-4 py-5 text-center">
              <p className="font-semibold text-slate-400" style={{ fontSize: 11 }}>Nessuna pratica aggiunta manualmente</p>
            </div>
          ) : (
            <div className="py-1">
              {recent.map((d) => (
                <div key={d.id} className="px-4 py-2.5">
                  <p className="truncate font-semibold text-slate-700" style={{ fontSize: 11 }} title={d.a}>{d.a.split(",")[0]}</p>
                  <p className="font-medium text-slate-400" style={{ fontSize: 9.5 }}>{d.city} · {eur(d.c)} · {d.r > 0 ? "+" : ""}{d.r.toFixed(1)}%</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

/* USER MENU — avatar with profile popover */
const UserMenu = ({ profile, onSaveProfile, onLogout }) => {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(profile);
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) { setOpen(false); setEditing(false); } };
    document.addEventListener("mousedown", handler, true);
    return () => document.removeEventListener("mousedown", handler, true);
  }, [open]);
  useEffect(() => { setDraft(profile); }, [profile]);
  const initials = profile.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  const handleSave = () => { onSaveProfile(draft); setEditing(false); };
  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full transition-all duration-200 hover:opacity-80"
        style={{ background: "linear-gradient(140deg,#a78bfa,#6366f1)", boxShadow: "0 4px 14px -3px rgba(99,102,241,.55),inset 0 1px 0 rgba(255,255,255,.3)" }}
      >
        <span className="font-black text-white" style={{ fontSize: 10.5, letterSpacing: "-.02em" }}>{initials}</span>
      </button>
      {open && (
        <div
          className="absolute bottom-12 left-1/2 z-[300] w-56 -translate-x-1/2 overflow-hidden rounded-2xl border border-white/70 backdrop-blur-[40px]"
          style={{ background: "rgba(255,255,255,.96)", boxShadow: "0 16px 44px -12px rgba(15,23,42,.3), inset 0 1px 0 rgba(255,255,255,.9)" }}
        >
          <div className="border-b border-slate-200/50 px-4 py-3">
            {editing ? (
              <div className="space-y-1.5">
                <input
                  value={draft.name}
                  onChange={(e) => setDraft((p) => ({ ...p, name: e.target.value }))}
                  onKeyDown={(e) => e.key === "Enter" && handleSave()}
                  className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 font-bold text-slate-800 outline-none"
                  style={{ fontSize: 12 }}
                  autoFocus
                />
                <input
                  value={draft.role}
                  onChange={(e) => setDraft((p) => ({ ...p, role: e.target.value }))}
                  onKeyDown={(e) => e.key === "Enter" && handleSave()}
                  className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-slate-500 outline-none"
                  style={{ fontSize: 11 }}
                />
                <button onClick={handleSave} className="w-full rounded-lg bg-indigo-500/10 py-1 font-bold text-indigo-600 transition-colors hover:bg-indigo-500/20" style={{ fontSize: 10.5 }}>Salva</button>
              </div>
            ) : (
              <div className="cursor-default" onClick={() => setEditing(true)} title="Clicca per modificare">
                <p className="font-black text-slate-800" style={{ fontSize: 12 }}>{profile.name}</p>
                <p className="text-slate-400" style={{ fontSize: 10 }}>{profile.role} · Elekta RE</p>
              </div>
            )}
          </div>
          <button
            onClick={onLogout}
            className="flex w-full items-center gap-2.5 px-4 py-2.5 font-semibold text-rose-600 transition-colors hover:bg-rose-500/[.06]"
            style={{ fontSize: 11 }}
          >
            <LogOut size={13} strokeWidth={1.5} />
            Esci e reimposta
          </button>
        </div>
      )}
    </div>
  );
};

/* DRAWER */
const DealDrawer = ({ deal, isClosing, onRequestClose, onExited, onEdit, onApprove }) => {
  const [open, setOpen] = useState(false);
  const asideRef = useRef(null);
  useEffect(() => {
    if (!isClosing) {
      const id = requestAnimationFrame(() => setOpen(true));
      return () => cancelAnimationFrame(id);
    }
  }, [deal?.id, isClosing]);
  useEffect(() => {
    if (isClosing) setOpen(false);
  }, [isClosing]);
  useEffect(() => {
    const esc = (e) => e.key === "Escape" && onRequestClose();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [onRequestClose]);
  useEffect(() => {
    if (!isClosing) return;
    const t = setTimeout(() => onExited(), 650);
    return () => clearTimeout(t);
  }, [isClosing, onExited]);
  if (!deal) return null;
  const capex = deal.c * 0.15,
    exit = deal.c * (1 + deal.r / 100),
    margin = exit - (deal.c + capex),
    peak = Math.max(deal.c, capex, exit, Math.abs(margin)),
    axes = riskAxes(deal),
    grade = riskGrade(deal);

  const handlePrint = () => printDeals([deal]);

  const onTransEnd = (e) => {
    if (e.propertyName === "transform" && isClosing && !open) onExited();
  };
  return (
    <>
      <div
        onClick={onRequestClose}
        className="fixed inset-0 z-40 transition-all duration-500 no-print"
        style={{
          background: open ? "rgba(15,23,42,.28)" : "rgba(15,23,42,0)",
          backdropFilter: open ? "blur(6px) saturate(55%)" : "blur(0px)",
          pointerEvents: open ? "auto" : "none",
        }}
      />
      <aside
        ref={asideRef}
        onTransitionEnd={onTransEnd}
        className="fixed bottom-0 right-0 top-0 z-50 flex flex-col overflow-hidden border-l border-white/60 backdrop-blur-[40px] no-print"
        style={{
          width: 448,
          maxWidth: "94vw",
          background: "linear-gradient(175deg,rgba(255,255,255,.95),rgba(248,250,252,.92))",
          transform: open ? "translateX(0)" : "translateX(100%)",
          transition: "transform .58s cubic-bezier(.22,1.02,.36,1)",
          boxShadow: "-24px 0 80px -20px rgba(15,23,42,.28), -2px 0 12px rgba(15,23,42,.06)",
        }}
      >
        <div
          className="pointer-events-none absolute -right-16 -top-24 h-72 w-72 rounded-full"
          style={{ background: "radial-gradient(circle,rgba(99,102,241,.14),transparent 66%)" }}
        />
        <div className="relative shrink-0 border-b border-slate-200/50 px-6 pb-4 pt-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <span
                className="h-3.5 w-1 rounded-full"
                style={{ background: "linear-gradient(180deg,#6366f1,#8b5cf6)" }}
              />
              <Eyebrow>Deal Intelligence</Eyebrow>
            </div>
            <button
              onClick={onRequestClose}
              className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200/70 bg-white/60 text-slate-500 transition-all duration-200 hover:rotate-90 hover:bg-slate-100"
            >
              <X size={15} strokeWidth={1.5} />
            </button>
          </div>
          <h2
            className="mt-3 pr-8 font-black text-slate-800"
            style={{ fontSize: 16, letterSpacing: "-.035em", lineHeight: 1.28 }}
          >
            {deal.a}
          </h2>
          <div className="mt-3 flex items-center gap-2">
            <TypeChip t={deal.t} />
            <StatusChip s={deal.status} />
            <span
              className="ml-auto font-black tabular-nums"
              style={{
                fontSize: 15,
                letterSpacing: "-.04em",
                color: deal.r >= 0 ? "#2563eb" : "#db2777",
              }}
            >
              {deal.r > 0 ? "+" : ""}
              {deal.r.toFixed(1)}%
            </span>
          </div>
        </div>
        <div className="scrollzone relative flex-1 overflow-y-auto pb-10">
          <div
            className="relative mx-6 mt-5 overflow-hidden rounded-2xl border border-slate-200/60 bg-gradient-to-br from-slate-100 to-slate-200"
            style={{
              height: 116,
              opacity: 0,
              animation: "riseIn .6s cubic-bezier(.22,1,.36,1) .1s forwards",
            }}
          >
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(0deg,transparent,transparent 26px,rgba(100,116,139,.09) 26px,rgba(100,116,139,.09) 27px),repeating-linear-gradient(90deg,transparent,transparent 26px,rgba(100,116,139,.09) 26px,rgba(100,116,139,.09) 27px)",
              }}
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(circle at 50% 45%,rgba(99,102,241,.16),transparent 62%)",
              }}
            />
            <div className="relative flex h-full flex-col items-center justify-center gap-2">
              <div
                className="flex h-11 w-11 items-center justify-center rounded-full bg-white/75 backdrop-blur-lg"
                style={{
                  boxShadow: "0 4px 16px rgba(99,102,241,.22),inset 0 0 0 1px rgba(99,102,241,.22)",
                }}
              >
                <MapPin size={19} strokeWidth={1.5} className="text-indigo-500" />
              </div>
              <p className="font-bold tracking-[.1em] text-slate-500" style={{ fontSize: 9.5 }}>
                STREET VIEW
              </p>
            </div>
          </div>
          <div
            className="relative mx-6 mt-4 overflow-hidden rounded-2xl border border-white/60 backdrop-blur-xl"
            style={{
              boxShadow: "0 4px 20px -6px rgba(99,102,241,.24),inset 0 1px 0 rgba(255,255,255,.7)",
              opacity: 0,
              animation: "riseIn .6s cubic-bezier(.22,1,.36,1) .16s forwards",
            }}
          >
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(115deg,rgba(99,102,241,.12),rgba(139,92,246,.07) 42%,rgba(236,72,153,.05) 78%,rgba(99,102,241,.10))",
                backgroundSize: "260% 260%",
                animation: "auroraShift 11s ease-in-out infinite",
              }}
            />
            <div className="relative flex items-start gap-3 p-4">
              <div
                className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
                style={{
                  background: "linear-gradient(140deg,#6366f1,#8b5cf6)",
                  boxShadow: "0 6px 18px -4px rgba(99,102,241,.6)",
                }}
              >
                <Sparkles
                  size={15}
                  strokeWidth={1.5}
                  className="text-white"
                  style={{ animation: "pulseGlow 2.6s ease-in-out infinite" }}
                />
                <span
                  className="absolute inset-0 rounded-xl"
                  style={{ animation: "ringPulse 2.6s ease-out infinite" }}
                />
              </div>
              <div className="min-w-0">
                <p
                  className="font-bold uppercase tracking-[.2em] text-indigo-500"
                  style={{ fontSize: 9 }}
                >
                  AI Deal Summary
                </p>
                <p className="mt-1.5 text-slate-700" style={{ fontSize: 11.5, lineHeight: 1.62 }}>
                  {aiVerdict(deal)}
                </p>
                <div className="mt-2.5 flex items-center gap-1.5">
                  <span
                    className="h-1.5 w-1.5 rounded-full bg-blue-500"
                    style={{
                      boxShadow: "0 0 6px #3b82f6",
                      animation: "blink 2.2s ease-in-out infinite",
                    }}
                  />
                  <span className="font-semibold text-slate-400" style={{ fontSize: 9 }}>
                    Elekta Intelligence v1.2
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="mx-6 mt-6">
            <div className="mb-3.5 flex items-center gap-1.5">
              <Layers size={11} strokeWidth={1.5} className="text-slate-400" />
              <Eyebrow>Financial Breakdown</Eyebrow>
            </div>
            <div className="space-y-3.5">
              <Gauge
                label="Valore Acquisizione"
                value={eurFull(deal.c)}
                pct={(deal.c / peak) * 100}
                hex="#475569"
                delay={0.24}
              />
              <Gauge
                label="CAPEX Stimato 15%"
                value={eurFull(capex)}
                pct={(capex / peak) * 100}
                hex="#8b5cf6"
                delay={0.3}
              />
              <Gauge
                label="Exit Value Atteso"
                value={eurFull(exit)}
                pct={(exit / peak) * 100}
                hex="#3b82f6"
                delay={0.36}
              />
              <Gauge
                label="Margine Netto"
                value={eurFull(margin)}
                pct={(Math.abs(margin) / peak) * 100}
                hex={margin > 0 ? "#2563eb" : "#db2777"}
                delay={0.42}
              />
            </div>
          </div>
          <div className="mx-6 mt-7">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Zap size={11} strokeWidth={1.5} className="text-slate-400" />
                <Eyebrow>Risk / Return Profiler</Eyebrow>
              </div>
              <span
                className="inline-flex items-center gap-1 rounded-lg font-bold ring-1"
                style={{
                  fontSize: 9.5,
                  padding: "3px 8px",
                  background: grade.bg,
                  color: grade.hex,
                }}
              >
                <ShieldCheck size={10} strokeWidth={1.5} />
                {grade.label}
              </span>
            </div>
            <div
              className="relative overflow-hidden rounded-2xl border border-slate-200/50"
              style={{
                background:
                  "radial-gradient(circle at 50% 46%,rgba(99,102,241,.10),rgba(248,250,252,.5) 62%)",
                opacity: 0,
                animation: "riseIn .65s cubic-bezier(.22,1,.36,1) .3s forwards",
              }}
            >
              <div className="h-52 px-2 pt-3">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart
                    data={axes}
                    margin={{ top: 8, right: 34, bottom: 8, left: 34 }}
                    outerRadius="76%"
                  >
                    <defs>
                      <radialGradient id="holoFill" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#818cf8" stopOpacity={0.34} />
                        <stop offset="55%" stopColor="#6366f1" stopOpacity={0.17} />
                        <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.05} />
                      </radialGradient>
                      <filter id="holoGlow" x="-40%" y="-40%" width="180%" height="180%">
                        <feDropShadow
                          dx="0"
                          dy="0"
                          stdDeviation="3.2"
                          floodColor="#6366f1"
                          floodOpacity="0.55"
                        />
                      </filter>
                    </defs>
                    <PolarGrid stroke="#cbd5e1" strokeOpacity={0.5} strokeWidth={0.7} />
                    <PolarAngleAxis
                      dataKey="subject"
                      tick={{ fontSize: 9.5, fill: "#64748b", fontWeight: 700 }}
                      tickLine={false}
                    />
                    <PolarRadiusAxis
                      angle={90}
                      domain={[0, 100]}
                      tickCount={5}
                      tick={{ fontSize: 7.5, fill: "#cbd5e1" }}
                      axisLine={false}
                    />
                    <Radar
                      dataKey="A"
                      stroke="#6366f1"
                      strokeWidth={2.2}
                      fill="url(#holoFill)"
                      isAnimationActive={false}
                      dot={{ r: 3.2, fill: "#fff", stroke: "#6366f1", strokeWidth: 2 }}
                      style={{ filter: "url(#holoGlow)" }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2 border-t border-slate-200/40 px-4 pb-4 pt-1">
                {axes.map((m, i) => {
                  const hex =
                    m.A >= 75
                      ? "#2563eb"
                      : m.A >= 50
                        ? "#6366f1"
                        : m.A >= 30
                          ? "#8b5cf6"
                          : "#db2777";
                  return (
                    <div
                      key={m.subject}
                      className="flex items-center gap-3"
                      style={{
                        opacity: 0,
                        animation:
                          "riseIn .5s cubic-bezier(.22,1,.36,1) " + (0.4 + i * 0.05) + "s forwards",
                      }}
                    >
                      <span
                        className="shrink-0 font-semibold text-slate-500"
                        style={{ fontSize: 10, width: 82 }}
                      >
                        {m.subject}
                      </span>
                      <div className="h-1 flex-1 rounded-full bg-slate-200/40">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: m.A + "%",
                            background: hex,
                            boxShadow: "0 0 6px " + hex + "88",
                            transition: "width .9s cubic-bezier(.22,1,.36,1)",
                          }}
                        />
                      </div>
                      <span
                        className="shrink-0 text-right font-black tabular-nums"
                        style={{ fontSize: 10, width: 20, color: hex }}
                      >
                        {m.A}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div
            className="mx-6 mt-6 grid gap-2.5"
            style={{ gridTemplateColumns: deal.source === "manual" ? "1fr 1fr 1fr" : "1fr 1fr", opacity: 0, animation: "riseIn .6s cubic-bezier(.22,1,.36,1) .5s forwards" }}
          >
            <button
              onClick={() => onApprove?.(deal)}
              className="flex items-center justify-center gap-2 rounded-2xl py-3 font-bold text-white transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0"
              style={{ fontSize: 11.5, background: "linear-gradient(140deg,#6366f1,#7c3aed)", boxShadow: "0 8px 22px -8px rgba(99,102,241,.75), inset 0 1px 0 rgba(255,255,255,.22)" }}
            >
              <Check size={14} strokeWidth={1.5} />
              Approva Deal
            </button>
            {deal.source === "manual" && (
              <button
                onClick={() => onEdit?.(deal)}
                className="flex items-center justify-center gap-2 rounded-2xl border border-indigo-300/60 bg-indigo-50/60 py-3 font-bold text-indigo-600 transition-all duration-200 hover:-translate-y-0.5 hover:bg-indigo-100/70 active:translate-y-0"
                style={{ fontSize: 11.5 }}
              >
                <Pencil size={14} strokeWidth={1.5} />
                Modifica
              </button>
            )}
            <button
              onClick={handlePrint}
              className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200/80 bg-white/65 py-3 font-bold text-slate-600 transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-50 active:translate-y-0"
              style={{ fontSize: 11.5 }}
            >
              <Printer size={14} strokeWidth={1.5} />
              Esporta Report
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

/* ══════════════════════════════════════════════════════════════════
   PRINT / EXPORT ENGINE
   ══════════════════════════════════════════════════════════════════ */
function printDeals(deals) {
  const root = document.getElementById("print-root");
  if (!root || !deals?.length) return;

  const rowsHtml = deals
    .map((d) => {
      const capex = d.c * 0.15;
      const exit = d.c * (1 + d.r / 100);
      const margin = exit - (d.c + capex);
      const grade = riskGrade(d);
      return `
      <div style="page-break-inside:avoid;border:1px solid #e2e8f0;border-radius:14px;padding:20px;margin-bottom:16px">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px">
          <div>
            <div style="font-size:9px;letter-spacing:.18em;text-transform:uppercase;color:#94a3b8;font-weight:700">${d.status} · ${d.t}</div>
            <div style="font-size:16px;font-weight:800;color:#1e293b;margin-top:4px">${d.a}</div>
            ${d.source === "manual" ? '<div style="font-size:8.5px;color:#d97706;font-weight:700;margin-top:3px;letter-spacing:.08em;text-transform:uppercase">◆ Aggiunto manualmente</div>' : ""}
            <div style="font-size:10px;color:#64748b;margin-top:2px">${d.city}</div>
          </div>
          <div style="text-align:right">
            <div style="font-size:20px;font-weight:900;color:${d.r >= 0 ? "#2563eb" : "#db2777"}">${d.r > 0 ? "+" : ""}${d.r.toFixed(1)}%</div>
            <div style="font-size:9px;color:#94a3b8;font-weight:700">ROI ATTESO</div>
          </div>
        </div>
        <table style="width:100%;border-collapse:collapse;margin-top:8px">
          <tr>
            <td style="padding:6px 0;font-size:9px;color:#94a3b8;text-transform:uppercase;letter-spacing:.1em;font-weight:700">Acquisizione</td>
            <td style="padding:6px 0;font-size:9px;color:#94a3b8;text-transform:uppercase;letter-spacing:.1em;font-weight:700">CAPEX 15%</td>
            <td style="padding:6px 0;font-size:9px;color:#94a3b8;text-transform:uppercase;letter-spacing:.1em;font-weight:700">Exit Value</td>
            <td style="padding:6px 0;font-size:9px;color:#94a3b8;text-transform:uppercase;letter-spacing:.1em;font-weight:700">Margine Netto</td>
            <td style="padding:6px 0;font-size:9px;color:#94a3b8;text-transform:uppercase;letter-spacing:.1em;font-weight:700">Rischio</td>
          </tr>
          <tr>
            <td style="padding:2px 0;font-size:13px;font-weight:800;color:#1e293b">${eurFull(d.c)}</td>
            <td style="padding:2px 0;font-size:13px;font-weight:800;color:#7c3aed">${eurFull(capex)}</td>
            <td style="padding:2px 0;font-size:13px;font-weight:800;color:#2563eb">${eurFull(exit)}</td>
            <td style="padding:2px 0;font-size:13px;font-weight:800;color:${margin > 0 ? "#2563eb" : "#db2777"}">${eurFull(margin)}</td>
            <td style="padding:2px 0;font-size:12px;font-weight:800;color:${grade.hex}">${grade.label}</td>
          </tr>
        </table>
        <div style="margin-top:10px;padding-top:10px;border-top:1px solid #f1f5f9;font-size:10.5px;line-height:1.6;color:#334155">
          <strong style="color:#6366f1;text-transform:uppercase;font-size:8.5px;letter-spacing:.12em">AI Deal Summary — </strong>
          ${aiVerdict(d)}
        </div>
      </div>`;
    })
    .join("");

  const isComparison = deals.length > 1;
  root.innerHTML = `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'SF Pro Display',Inter,sans-serif;padding:32px;color:#1e293b">
      <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:2px solid #1e293b;padding-bottom:14px;margin-bottom:24px">
        <div>
          <div style="font-size:19px;font-weight:900;letter-spacing:-.02em">Elekta — Investment Terminal</div>
          <div style="font-size:10.5px;color:#64748b;margin-top:2px">${isComparison ? "Report di Comparazione Deal" : "Deal Intelligence Report"} · Generato il ${new Date().toLocaleDateString("it-IT", { day: "2-digit", month: "long", year: "numeric" })}</div>
        </div>
        <div style="width:34px;height:34px;border-radius:10px;background:#1e293b;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:900;font-size:14px">E</div>
      </div>
      ${rowsHtml}
      <div style="margin-top:20px;font-size:8.5px;color:#94a3b8;text-align:center">Documento generato automaticamente da Elekta Investment Terminal — uso interno riservato</div>
    </div>`;

  requestAnimationFrame(() => window.print());
}

/* ══════════════════════════════════════════════════════════════════
   COMPARE DRAWER
   ══════════════════════════════════════════════════════════════════ */
const COMPARE_COLORS = ["#6366f1", "#2563eb", "#7c3aed"];

const CompareDrawer = ({ deals, isClosing, onRequestClose, onExited, onRemove }) => {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!isClosing) {
      const id = requestAnimationFrame(() => setOpen(true));
      return () => cancelAnimationFrame(id);
    }
  }, [isClosing]);
  useEffect(() => {
    if (isClosing) setOpen(false);
  }, [isClosing]);
  useEffect(() => {
    const esc = (e) => e.key === "Escape" && onRequestClose();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [onRequestClose]);
  useEffect(() => {
    if (!isClosing) return;
    const t = setTimeout(() => onExited(), 650);
    return () => clearTimeout(t);
  }, [isClosing, onExited]);

  if (!deals?.length) return null;

  const axesLabels = ["Location", "Liquidità", "Rendimento", "Cantiere", "Mercato"];
  const overlaidRadar = axesLabels.map((subject) => {
    const row = { subject };
    deals.forEach((d, i) => {
      const axes = riskAxes(d);
      const match = axes.find((a) => a.subject === subject);
      row["d" + i] = match ? match.A : 0;
    });
    return row;
  });

  const metrics = deals.map((d) => {
    const capex = d.c * 0.15;
    const exit = d.c * (1 + d.r / 100);
    const margin = exit - (d.c + capex);
    return { ...d, capex, exit, margin, grade: riskGrade(d) };
  });
  const peak = Math.max(...metrics.flatMap((m) => [m.c, m.capex, m.exit, Math.abs(m.margin)]));

  return (
    <>
      <div
        onClick={onRequestClose}
        className="fixed inset-0 z-40 transition-all duration-500 no-print"
        style={{
          background: open ? "rgba(15,23,42,.32)" : "rgba(15,23,42,0)",
          backdropFilter: open ? "blur(7px) saturate(52%)" : "blur(0px)",
          pointerEvents: open ? "auto" : "none",
        }}
      />
      <aside
        className="fixed bottom-0 right-0 top-0 z-50 flex flex-col overflow-hidden border-l border-white/60 backdrop-blur-[40px] no-print"
        style={{
          width: Math.min(920, deals.length === 2 ? 760 : 920),
          maxWidth: "96vw",
          background: "linear-gradient(175deg,rgba(255,255,255,.96),rgba(248,250,252,.93))",
          transform: open ? "translateX(0)" : "translateX(100%)",
          transition: "transform .58s cubic-bezier(.22,1.02,.36,1)",
          boxShadow: "-24px 0 80px -20px rgba(15,23,42,.28), -2px 0 12px rgba(15,23,42,.06)",
        }}
      >
        <div
          className="pointer-events-none absolute -right-20 -top-24 h-80 w-80 rounded-full"
          style={{ background: "radial-gradient(circle,rgba(99,102,241,.14),transparent 66%)" }}
        />
        <div className="relative shrink-0 border-b border-slate-200/50 px-7 pb-4 pt-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <span
                className="flex h-6 w-6 items-center justify-center rounded-lg"
                style={{ background: "linear-gradient(140deg,#6366f1,#8b5cf6)" }}
              >
                <Scale size={12} strokeWidth={1.6} className="text-white" />
              </span>
              <div>
                <Eyebrow>Comparazione Deal</Eyebrow>
                <p className="mt-0.5 font-black text-slate-800" style={{ fontSize: 15, letterSpacing: "-.03em" }}>
                  {deals.length} pratiche a confronto
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => printDeals(deals)}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200/80 bg-white/70 px-3 py-1.5 font-bold text-slate-600 transition-all hover:bg-white"
                style={{ fontSize: 10.5 }}
              >
                <Printer size={12} strokeWidth={1.5} />
                Esporta PDF
              </button>
              <button
                onClick={onRequestClose}
                className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200/70 bg-white/60 text-slate-500 transition-all duration-200 hover:rotate-90 hover:bg-slate-100"
              >
                <X size={15} strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </div>

        <div className="scrollzone relative flex-1 overflow-y-auto p-7">
          <div
            className="grid gap-4"
            style={{ gridTemplateColumns: `repeat(${deals.length}, minmax(0, 1fr))` }}
          >
            {metrics.map((d, i) => (
              <div
                key={d.id}
                className="relative rounded-2xl border border-white/60 p-4"
                style={{
                  background: "linear-gradient(165deg,rgba(255,255,255,.85),rgba(255,255,255,.55))",
                  boxShadow: "0 4px 16px -6px rgba(15,23,42,.12)",
                  opacity: 0,
                  animation: `riseIn .5s cubic-bezier(.22,1,.36,1) ${0.08 + i * 0.08}s forwards`,
                }}
              >
                <button
                  onClick={() => onRemove(d.id)}
                  className="absolute right-2.5 top-2.5 flex h-6 w-6 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                  title="Rimuovi dal confronto"
                >
                  <X size={12} strokeWidth={1.7} />
                </button>
                <span
                  className="mb-2 inline-block h-1.5 w-8 rounded-full"
                  style={{ background: COMPARE_COLORS[i % COMPARE_COLORS.length] }}
                />
                <p
                  className="pr-6 font-black leading-snug text-slate-800"
                  style={{ fontSize: 12.5, letterSpacing: "-.02em" }}
                  title={d.a}
                >
                  {d.a.length > 42 ? d.a.slice(0, 42) + "…" : d.a}
                </p>
                <div className="mt-2 flex items-center gap-1.5">
                  <TypeChip t={d.t} />
                  <StatusChip s={d.status} />
                </div>
                <p
                  className="mt-3 font-black tabular-nums"
                  style={{
                    fontSize: 22,
                    letterSpacing: "-.04em",
                    color: d.r >= 0 ? "#2563eb" : "#db2777",
                  }}
                >
                  {d.r > 0 ? "+" : ""}
                  {d.r.toFixed(1)}%
                </p>
                <p className="text-slate-400" style={{ fontSize: 9.5 }}>
                  ROI atteso
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <div className="mb-3 flex items-center gap-1.5">
              <Layers size={11} strokeWidth={1.5} className="text-slate-400" />
              <Eyebrow>Financial Breakdown — Confronto</Eyebrow>
            </div>
            <div
              className="overflow-hidden rounded-2xl border border-slate-200/60"
              style={{
                background: "rgba(255,255,255,.6)",
                opacity: 0,
                animation: "riseIn .55s cubic-bezier(.22,1,.36,1) .28s forwards",
              }}
            >
              {[
                { key: "c", label: "Valore Acquisizione" },
                { key: "capex", label: "CAPEX Stimato 15%" },
                { key: "exit", label: "Exit Value Atteso" },
                { key: "margin", label: "Margine Netto" },
              ].map((row, ri) => (
                <div
                  key={row.key}
                  className="px-5 py-3"
                  style={{ borderTop: ri ? "1px solid rgba(226,232,240,.5)" : "none" }}
                >
                  <Eyebrow>{row.label}</Eyebrow>
                  <div
                    className="mt-2 grid gap-4"
                    style={{ gridTemplateColumns: `repeat(${deals.length}, minmax(0, 1fr))` }}
                  >
                    {metrics.map((d, i) => {
                      const val = d[row.key];
                      const hex =
                        row.key === "margin"
                          ? val > 0
                            ? "#2563eb"
                            : "#db2777"
                          : COMPARE_COLORS[i % COMPARE_COLORS.length];
                      return (
                        <div key={d.id}>
                          <div className="flex items-baseline justify-between">
                            <span
                              className="font-black tabular-nums"
                              style={{ fontSize: 13, color: hex, letterSpacing: "-.02em" }}
                            >
                              {eurFull(val)}
                            </span>
                          </div>
                          <div className="mt-1 h-1 overflow-hidden rounded-full bg-slate-200/40">
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: Math.max(2, Math.min(100, (Math.abs(val) / peak) * 100)) + "%",
                                background: hex,
                                transition: "width .8s cubic-bezier(.22,1,.36,1)",
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-7">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Zap size={11} strokeWidth={1.5} className="text-slate-400" />
                <Eyebrow>Risk / Return — Radar Sovrapposto</Eyebrow>
              </div>
              <div className="flex items-center gap-3">
                {metrics.map((d, i) => (
                  <span key={d.id} className="flex items-center gap-1.5" style={{ fontSize: 9.5 }}>
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ background: COMPARE_COLORS[i % COMPARE_COLORS.length] }}
                    />
                    <span className="font-semibold text-slate-500">
                      {d.a.split(",")[0].length > 16 ? d.a.split(",")[0].slice(0, 16) + "…" : d.a.split(",")[0]}
                    </span>
                  </span>
                ))}
              </div>
            </div>
            <div
              className="relative overflow-hidden rounded-2xl border border-slate-200/50"
              style={{
                background:
                  "radial-gradient(circle at 50% 46%,rgba(99,102,241,.10),rgba(248,250,252,.5) 62%)",
                opacity: 0,
                animation: "riseIn .6s cubic-bezier(.22,1,.36,1) .36s forwards",
              }}
            >
              <div className="h-72 px-4 pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart
                    data={overlaidRadar}
                    margin={{ top: 8, right: 40, bottom: 8, left: 40 }}
                    outerRadius="76%"
                  >
                    <PolarGrid stroke="#cbd5e1" strokeOpacity={0.5} strokeWidth={0.7} />
                    <PolarAngleAxis
                      dataKey="subject"
                      tick={{ fontSize: 10.5, fill: "#64748b", fontWeight: 700 }}
                      tickLine={false}
                    />
                    <PolarRadiusAxis
                      angle={90}
                      domain={[0, 100]}
                      tickCount={5}
                      tick={{ fontSize: 8, fill: "#cbd5e1" }}
                      axisLine={false}
                    />
                    {metrics.map((d, i) => (
                      <Radar
                        key={d.id}
                        name={d.a}
                        dataKey={"d" + i}
                        stroke={COMPARE_COLORS[i % COMPARE_COLORS.length]}
                        strokeWidth={2.2}
                        fill={COMPARE_COLORS[i % COMPARE_COLORS.length]}
                        fillOpacity={0.1}
                        isAnimationActive={false}
                        dot={{ r: 3, fill: "#fff", stroke: COMPARE_COLORS[i % COMPARE_COLORS.length], strokeWidth: 2 }}
                      />
                    ))}
                    <Tooltip
                      content={({ active, payload, label }) =>
                        active && payload?.length ? (
                          <div
                            className="bg-white/95 rounded-xl border border-white/70 p-2.5 backdrop-blur-2xl"
                            style={{ boxShadow: "0 8px 24px rgba(15,23,42,.14)" }}
                          >
                            <p className="mb-1 font-bold text-slate-700" style={{ fontSize: 10.5 }}>
                              {label}
                            </p>
                            {payload.map((p, i) => (
                              <p key={i} style={{ fontSize: 10, color: p.color, fontWeight: 700 }}>
                                {metrics[i]?.a.split(",")[0]}: {p.value}
                              </p>
                            ))}
                          </div>
                        ) : null
                      }
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div
            className="mt-6 grid gap-4"
            style={{ gridTemplateColumns: `repeat(${deals.length}, minmax(0, 1fr))` }}
          >
            {metrics.map((d, i) => (
              <div
                key={d.id}
                className="rounded-2xl border border-white/60 p-3.5"
                style={{
                  background: "linear-gradient(165deg,rgba(99,102,241,.06),rgba(139,92,246,.03))",
                  opacity: 0,
                  animation: `riseIn .5s cubic-bezier(.22,1,.36,1) ${0.5 + i * 0.06}s forwards`,
                }}
              >
                <p
                  className="mb-1.5 font-bold uppercase tracking-[.15em]"
                  style={{ fontSize: 8, color: COMPARE_COLORS[i % COMPARE_COLORS.length] }}
                >
                  Verdetto AI
                </p>
                <p className="text-slate-600" style={{ fontSize: 10, lineHeight: 1.55 }}>
                  {aiVerdict(d)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </>
  );
};

/* ══════════════════════════════════════════════════════════════════
   COMMAND PALETTE
   ══════════════════════════════════════════════════════════════════ */
function buildCommands({ setNav, openDeal, applyQuickFilter, allDeals, openNewDeal }) {
  const navCommands = [
    { id: "nav-dashboard", group: "Naviga", icon: LayoutDashboard, label: "Vai a Dashboard", action: () => setNav("dashboard"), keywords: "home overview panoramica" },
    { id: "nav-portfolio", group: "Naviga", icon: Briefcase, label: "Vai a Portafoglio", action: () => setNav("portfolio"), keywords: "deal screener pratiche lista" },
    { id: "nav-map", group: "Naviga", icon: Map, label: "Vai a Mappa Asset", action: () => setNav("map"), keywords: "geografia città google maps" },
    { id: "nav-report", group: "Naviga", icon: FileText, label: "Vai a Report", action: () => setNav("report"), keywords: "documenti pdf" },
    { id: "nav-settings", group: "Naviga", icon: Settings, label: "Vai a Impostazioni", action: () => setNav("settings"), keywords: "profilo account" },
  ];
  const actionCommands = [
    { id: "action-new-deal", group: "Azioni", icon: Plus, label: "Aggiungi nuova pratica", action: openNewDeal, keywords: "nuovo pratica aggiunge manuale form inserisci" },
    { id: "action-export-pdf", group: "Azioni", icon: Download, label: "Esporta report top 10 deal", action: () => printDeals([...allDeals].sort((a, b) => b.r - a.r).slice(0, 10)), keywords: "esporta pdf report stampa top" },
  ];
  const filterCommands = [
    { id: "filter-target", group: "Filtri Rapidi", icon: Target, label: "Filtra: ROI superiore al 10%", action: () => applyQuickFilter("target"), keywords: "target soglia deal in target" },
    { id: "filter-20", group: "Filtri Rapidi", icon: TrendingUp, label: "Filtra: ROI superiore al 20%", action: () => applyQuickFilter("target20"), keywords: "premium alto rendimento" },
    { id: "filter-pos", group: "Filtri Rapidi", icon: ArrowUpRight, label: "Filtra: solo ROI positivi", action: () => applyQuickFilter("pos"), keywords: "positivi guadagno" },
    { id: "filter-neg", group: "Filtri Rapidi", icon: ArrowDownRight, label: "Filtra: solo ROI negativi", action: () => applyQuickFilter("neg"), keywords: "negativi perdita scartati" },
    { id: "filter-milano", group: "Filtri Rapidi", icon: Building2, label: "Filtra: solo Milano", action: () => applyQuickFilter("milano"), keywords: "città milano mi" },
    { id: "filter-torino", group: "Filtri Rapidi", icon: Building2, label: "Filtra: solo Torino", action: () => applyQuickFilter("torino"), keywords: "città torino to" },
    { id: "filter-genova", group: "Filtri Rapidi", icon: Building2, label: "Filtra: solo Genova", action: () => applyQuickFilter("genova"), keywords: "città genova ge" },
    { id: "filter-terreno", group: "Filtri Rapidi", icon: TreePine, label: "Filtra: solo Terreni", action: () => applyQuickFilter("terreno"), keywords: "asset class terreno" },
  ];
  const dealCommands = allDeals.map((d) => ({
    id: "deal-" + d.id,
    group: "Pratiche",
    icon: d.r >= 20 ? Target : d.r >= 0 ? Building2 : AlertTriangle,
    label: d.a,
    sublabel: `${d.city} · ${eur(d.c)} · ${d.r > 0 ? "+" : ""}${d.r.toFixed(1)}% ROI`,
    action: () => openDeal(d),
    keywords: d.a + " " + d.city + " " + d.t,
    roi: d.r,
  }));
  return { navCommands, actionCommands, filterCommands, dealCommands };
}

const CommandPalette = ({ isOpen, onClose, setNav, openDeal, applyQuickFilter, allDeals, openNewDeal }) => {
  const [query, setQuery] = useState("");
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef(null);

  const { navCommands, actionCommands, filterCommands, dealCommands } = useMemo(
    () => buildCommands({ setNav, openDeal, applyQuickFilter, allDeals, openNewDeal }),
    [setNav, openDeal, applyQuickFilter, allDeals, openNewDeal]
  );

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      const topDeals = [...dealCommands].sort((a, b) => b.roi - a.roi).slice(0, 5);
      return [...navCommands, ...actionCommands, ...filterCommands.slice(0, 3), ...topDeals];
    }
    const all = [...navCommands, ...actionCommands, ...filterCommands, ...dealCommands];
    return all
      .filter((c) => (c.label + " " + (c.keywords || "")).toLowerCase().includes(q))
      .slice(0, 40);
  }, [query, navCommands, filterCommands, dealCommands]);

  useEffect(() => {
    setActiveIdx(0);
  }, [query, isOpen]);

  useEffect(() => {
    if (isOpen) {
      const t = setTimeout(() => inputRef.current?.focus(), 60);
      return () => clearTimeout(t);
    } else {
      setQuery("");
    }
  }, [isOpen]);

  const run = useCallback(
    (cmd) => {
      cmd.action();
      onClose();
    },
    [onClose]
  );

  const onKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => Math.min(results.length - 1, i + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => Math.max(0, i - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (results[activeIdx]) run(results[activeIdx]);
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  if (!isOpen) return null;

  const grouped = [];
  results.forEach((r) => {
    let g = grouped.find((x) => x.group === r.group);
    if (!g) {
      g = { group: r.group, items: [] };
      grouped.push(g);
    }
    g.items.push(r);
  });
  let flatIndex = -1;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center pt-[14vh] no-print"
      style={{ background: "rgba(15,23,42,.4)", backdropFilter: "blur(6px) saturate(60%)" }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        onKeyDown={onKeyDown}
        className="w-full overflow-hidden rounded-2xl border border-white/60"
        style={{
          maxWidth: 560,
          background: "rgba(255,255,255,.92)",
          backdropFilter: "blur(30px)",
          boxShadow: "0 24px 70px -14px rgba(15,23,42,.4), 0 4px 16px rgba(15,23,42,.15)",
          animation: "paletteIn .22s cubic-bezier(.22,1,.36,1) forwards",
        }}
      >
        <div className="flex items-center gap-3 border-b border-slate-200/60 px-4 py-3.5">
          <Search size={15} strokeWidth={1.8} className="shrink-0 text-slate-400" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cerca una pratica, vai a una sezione, applica un filtro…"
            className="flex-1 bg-transparent text-slate-800 outline-none placeholder-slate-400"
            style={{ fontSize: 13.5, fontWeight: 500 }}
          />
          <span
            className="shrink-0 rounded-md border border-slate-200 px-1.5 py-0.5 font-bold text-slate-400"
            style={{ fontSize: 9.5 }}
          >
            ESC
          </span>
        </div>

        <div className="scrollzone max-h-[420px] overflow-y-auto p-2">
          {results.length === 0 && (
            <div className="flex flex-col items-center gap-2 py-10 text-center">
              <Search size={20} className="text-slate-300" />
              <p className="font-semibold text-slate-400" style={{ fontSize: 12 }}>
                Nessun risultato per \u201C{query}\u201D
              </p>
            </div>
          )}
          {grouped.map((g) => (
            <div key={g.group} className="mb-1.5">
              <p
                className="px-2.5 py-1.5 font-bold uppercase tracking-[.15em] text-slate-400"
                style={{ fontSize: 9 }}
              >
                {g.group}
              </p>
              {g.items.map((cmd) => {
                flatIndex += 1;
                const isActive = flatIndex === activeIdx;
                const CmdIcon = cmd.icon;
                return (
                  <button
                    key={cmd.id}
                    onMouseEnter={() => setActiveIdx(flatIndex)}
                    onClick={() => run(cmd)}
                    className="flex w-full items-center gap-3 rounded-xl px-2.5 py-2 text-left transition-colors duration-100"
                    style={{
                      background: isActive ? "rgba(99,102,241,.09)" : "transparent",
                    }}
                  >
                    <span
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg"
                      style={{
                        background: isActive ? "rgba(99,102,241,.14)" : "rgba(148,163,184,.10)",
                        color: isActive ? "#4f46e5" : "#64748b",
                      }}
                    >
                      <CmdIcon size={13} strokeWidth={1.6} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span
                        className="block truncate font-semibold text-slate-700"
                        style={{ fontSize: 12 }}
                      >
                        {cmd.label}
                      </span>
                      {cmd.sublabel && (
                        <span className="block truncate text-slate-400" style={{ fontSize: 10 }}>
                          {cmd.sublabel}
                        </span>
                      )}
                    </span>
                    {isActive && (
                      <CornerDownLeft size={12} strokeWidth={1.8} className="shrink-0 text-indigo-400" />
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        <div className="flex items-center gap-4 border-t border-slate-200/60 px-4 py-2.5">
          <span className="flex items-center gap-1 text-slate-400" style={{ fontSize: 10 }}>
            <span className="rounded border border-slate-200 px-1.5 py-0.5 font-bold">\u2191\u2193</span>
            naviga
          </span>
          <span className="flex items-center gap-1 text-slate-400" style={{ fontSize: 10 }}>
            <span className="rounded border border-slate-200 px-1.5 py-0.5 font-bold">\u21B5</span>
            seleziona
          </span>
          <span className="ml-auto flex items-center gap-1 text-slate-400" style={{ fontSize: 10 }}>
            <Hash size={10} strokeWidth={1.8} />
            {results.length} risultati
          </span>
        </div>
      </div>
    </div>
  );
};

/* ROW MENU */
const RowMenu = ({ row, isOpen, onToggle, onCloseMenu, onOpenDeal, isRowHovered, isManual, onEdit, onDelete, onApprove, onSuspend }) => {
  const ref = useRef(null);
  useEffect(() => {
    if (!isOpen) return;
    const down = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onCloseMenu();
    };
    const key = (e) => {
      if (e.key === "Escape") onCloseMenu();
    };
    document.addEventListener("mousedown", down, true);
    document.addEventListener("keydown", key);
    return () => {
      document.removeEventListener("mousedown", down, true);
      document.removeEventListener("keydown", key);
    };
  }, [isOpen, onCloseMenu]);
  return (
    <div className="relative flex justify-end" ref={ref}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggle();
        }}
        className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 transition-all duration-200"
        style={{
          opacity: isRowHovered || isOpen ? 1 : 0,
          background: isOpen ? "rgba(241,245,249,.9)" : "transparent",
        }}
      >
        <MoreHorizontal size={14} strokeWidth={1.5} />
      </button>
      {isOpen && (
        <div
          className="bg-white/96 absolute right-0 z-[60] rounded-2xl border border-white/70 py-1.5 backdrop-blur-3xl"
          style={{
            top: "calc(100% + 6px)",
            minWidth: 168,
            animation: "riseIn .22s cubic-bezier(.22,1,.36,1) forwards",
            boxShadow: "0 16px 44px -12px rgba(15,23,42,.28), inset 0 1px 0 rgba(255,255,255,.9)",
          }}
        >
          {[
            [Eye, "Deal Intelligence", () => onOpenDeal(row), false],
            ...(isManual ? [[Pencil, "Modifica", () => onEdit?.(), false]] : []),
            [Check, "Approva", () => onApprove?.(row), false],
            [Clock, "Sospendi", () => onSuspend?.(row), false],
            [Trash2, "Elimina", () => onDelete?.(), true],
          ].map(([I, l, act, danger]) => (
            <button
              key={l}
              onClick={(e) => {
                e.stopPropagation();
                onCloseMenu();
                act?.();
              }}
              className={
                "flex w-full items-center gap-2.5 font-semibold transition-colors duration-150 " +
                (danger
                  ? "text-rose-600 hover:bg-rose-500/[.07]"
                  : "text-slate-700 hover:bg-indigo-500/[.07]")
              }
              style={{ fontSize: 11, padding: "7px 14px" }}
            >
              <I size={13} strokeWidth={1.5} />
              {l}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

/* VIEW TRANSITION */
const ViewTransition = ({ viewKey, children }) => {
  const [displayedKey, setDisplayedKey] = useState(viewKey);
  const [phase, setPhase] = useState("enter");
  const contentRef = useRef(children);
  useEffect(() => {
    if (viewKey !== displayedKey) {
      setPhase("exit");
      const t = setTimeout(() => {
        contentRef.current = children;
        setDisplayedKey(viewKey);
        setPhase("enter");
      }, 200);
      return () => clearTimeout(t);
    } else {
      contentRef.current = children;
    }
  }, [viewKey, children, displayedKey]);
  return (
    <div key={displayedKey} className={phase === "enter" ? "view-enter" : "view-exit"}>
      {contentRef.current}
    </div>
  );
};

/* ══════ DASHBOARD VIEW ══════ */
const DashboardView = memo(({ onOpenDeal, allDeals }) => {
  const [pieHover, setPieHover] = useState(null);
  const hi = useMemo(() => allDeals.filter((d) => d.r > 10), [allDeals]);
  const mid = useMemo(() => allDeals.filter((d) => d.r > 0 && d.r <= 10), [allDeals]);
  const lo = useMemo(() => allDeals.filter((d) => d.r <= 0), [allDeals]);

  const totalCap = useMemo(() => allDeals.reduce((s, d) => s + d.c, 0), [allDeals]);
  const posDeals = useMemo(() => allDeals.filter((d) => d.r > 0), [allDeals]);
  const avgRoi = posDeals.length ? posDeals.reduce((s, d) => s + d.r, 0) / posDeals.length : 0;
  const targetCount = useMemo(() => allDeals.filter((d) => d.r > 10).length, [allDeals]);
  const totalCount = allDeals.length;

  const animatedTotal = useCountUp(totalCount);
  const animatedTarget = useCountUp(targetCount);

  const allocDynamic = useMemo(() => [
    { name: "Stabili", value: allDeals.filter((d) => d.t === "Stabili").length, color: "#6366f1", glow: "#818cf8" },
    { name: "Terreno", value: allDeals.filter((d) => d.t === "Terreno").length, color: "#3b82f6", glow: "#60a5fa" },
  ], [allDeals]);
  return (
    <div className="space-y-6 px-8 py-8">
      <div className="grid grid-cols-4 gap-5">
        <Kpi
          index={0}
          label="Capitale Analizzato"
          value={eur(totalCap)}
          detail={"\u20AC" + Math.round(totalCap).toLocaleString("it-IT") + " AUM"}
          delta="+8.4% vs Q2"
          color="#6366f1"
          spark={SPARK.cap}
          uid="a"
        />
        <Kpi
          index={1}
          label="ROI Medio Positivo"
          value={(avgRoi > 0 ? "+" : "") + avgRoi.toFixed(1) + "%"}
          detail={posDeals.length + " asset in gain"}
          delta="+2.1% vs Q2"
          color="#3b82f6"
          spark={SPARK.roi}
          uid="b"
        />
        <Kpi
          index={2}
          label="Deal in Target"
          value={animatedTarget.toString()}
          detail="ROI oltre soglia 10%"
          delta="+12 vs Q2"
          color="#8b5cf6"
          spark={SPARK.deals}
          uid="c"
        />
        <Kpi
          index={3}
          label="Pratiche Totali"
          value={animatedTotal.toString()}
          detail="GE · MI · TO · RM"
          delta="+36 vs Q2"
          color="#334155"
          spark={SPARK.count}
          uid="d"
        />
      </div>
      <div className="grid gap-5" style={{ gridTemplateColumns: "1.75fr 1fr 316px" }}>
        <GlassCard delay={0.32} className="overflow-visible">
          <div className="flex items-start justify-between px-6 pb-3 pt-6">
            <div>
              <h3 className="font-black tracking-tighter text-slate-800" style={{ fontSize: 14 }}>
                Opportunity Matrix
              </h3>
              <p className="mt-1 text-slate-400" style={{ fontSize: 10 }}>
                Costo × ROI — segmentazione a quattro quadranti
              </p>
            </div>
            <div className="flex gap-3">
              {[
                ["#60a5fa", "> 10%"],
                ["#a5b4fc", "0–10%"],
                ["#f9a8d4", "Negativo"],
              ].map(([c, l]) => (
                <span
                  key={l}
                  className="flex items-center gap-1.5 font-semibold text-slate-500"
                  style={{ fontSize: 9.5 }}
                >
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ background: c, boxShadow: "0 0 7px " + c }}
                  />
                  {l}
                </span>
              ))}
            </div>
          </div>
          <div style={{ height: 270 }} className="px-3 pb-2">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 10, right: 14, bottom: 6, left: -6 }}>
                <defs>
                  <linearGradient id="qSweet" x1="0" y1="0" x2=".4" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.16} />
                    <stop offset="55%" stopColor="#60a5fa" stopOpacity={0.06} />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.01} />
                  </linearGradient>
                  <linearGradient id="qHigh" x1="1" y1="0" x2=".4" y2="1">
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.13} />
                    <stop offset="60%" stopColor="#a78bfa" stopOpacity={0.045} />
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.01} />
                  </linearGradient>
                  <linearGradient id="qDrop" x1="0" y1="1" x2=".3" y2="0">
                    <stop offset="0%" stopColor="#db2777" stopOpacity={0.12} />
                    <stop offset="60%" stopColor="#f472b6" stopOpacity={0.04} />
                    <stop offset="100%" stopColor="#db2777" stopOpacity={0} />
                  </linearGradient>
                  <filter id="dotBlue" x="-60%" y="-60%" width="220%" height="220%">
                    <feDropShadow dx="0" dy=".5" stdDeviation="2.4" floodColor="#3b82f6" floodOpacity=".75" />
                  </filter>
                  <filter id="dotIndigo" x="-60%" y="-60%" width="220%" height="220%">
                    <feDropShadow dx="0" dy=".5" stdDeviation="1.7" floodColor="#6366f1" floodOpacity=".5" />
                  </filter>
                </defs>
                <CartesianGrid strokeDasharray="1 6" stroke="#cbd5e1" strokeOpacity={0.42} />
                <ReferenceArea x1={0} x2={1400000} y1={10} y2={112} fill="url(#qSweet)" />
                <ReferenceArea x1={1400000} x2={6000000} y1={10} y2={112} fill="url(#qHigh)" />
                <ReferenceArea x1={0} x2={6000000} y1={-70} y2={0} fill="url(#qDrop)" />
                <XAxis
                  dataKey="c"
                  type="number"
                  domain={[0, 5800000]}
                  tickFormatter={(v) => "\u20AC" + Math.round(v / 1000) + "K"}
                  tick={{ fontSize: 9, fill: "#94a3b8", fontWeight: 600 }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  dataKey="r"
                  type="number"
                  domain={[-70, 112]}
                  tickFormatter={(v) => v + "%"}
                  tick={{ fontSize: 9, fill: "#94a3b8", fontWeight: 600 }}
                  tickLine={false}
                  axisLine={false}
                  width={38}
                />
                <Tooltip
                  content={<ScatterTip />}
                  cursor={{ strokeDasharray: "3 4", stroke: "#c7d2fe" }}
                  wrapperStyle={{ zIndex: 1000, pointerEvents: "none" }}
                />
                <ReferenceLine y={10} stroke="#3b82f6" strokeDasharray="5 4" strokeWidth={1.2} strokeOpacity={0.62} />
                <ReferenceLine y={0} stroke="#cbd5e1" strokeWidth={1} />
                <ReferenceLine x={1400000} stroke="#cbd5e1" strokeDasharray="3 4" strokeWidth={1} />
                <Scatter data={lo} fill="#f9a8d4" fillOpacity={0.52} isAnimationActive={false} />
                <Scatter data={mid} fill="#a5b4fc" fillOpacity={0.78} isAnimationActive={false} style={{ filter: "url(#dotIndigo)" }} />
                <Scatter data={hi} fill="#60a5fa" fillOpacity={0.92} isAnimationActive={false} style={{ filter: "url(#dotBlue)" }} />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-3 border-t border-slate-200/40">
            {[
              ["Sweet Spot", "Basso costo · Alto ROI", "#2563eb"],
              ["High Value", "Alto costo · Alto ROI", "#7c3aed"],
              ["Da Scartare", "Rendimento negativo", "#db2777"],
            ].map(([k, v, c], i) => (
              <div
                key={k}
                className="px-3 py-3 text-center"
                style={{ borderLeft: i ? "1px solid rgba(226,232,240,.5)" : "none" }}
              >
                <Eyebrow>{k}</Eyebrow>
                <p className="mt-1 font-black" style={{ fontSize: 10.5, color: c }}>
                  {v}
                </p>
              </div>
            ))}
          </div>
        </GlassCard>
        <GlassCard delay={0.39} className="overflow-visible">
          <div className="px-5 pb-2 pt-6">
            <h3 className="font-black tracking-tighter text-slate-800" style={{ fontSize: 14 }}>
              Concentrazione Geografica
            </h3>
            <p className="mt-1 text-slate-400" style={{ fontSize: 10 }}>
              Capitale per provincia
            </p>
          </div>
          <div style={{ height: 238 }} className="px-2 pb-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={CITY_CAP} layout="vertical" margin={{ top: 6, right: 62, bottom: 6, left: 32 }}>
                <defs>
                  {CITY_HUES.map((c, i) => (
                    <linearGradient key={i} id={"gb" + i} x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor={c} stopOpacity={0.55} />
                      <stop offset="100%" stopColor={c} stopOpacity={0.96} />
                    </linearGradient>
                  ))}
                  <filter id="barLift" x="-10%" y="-40%" width="140%" height="200%">
                    <feDropShadow dx="1.5" dy="1.5" stdDeviation="2.2" floodColor="#6366f1" floodOpacity=".28" />
                  </filter>
                </defs>
                <CartesianGrid strokeDasharray="1 6" stroke="#cbd5e1" strokeOpacity={0.4} horizontal={false} />
                <XAxis type="number" tickFormatter={(v) => "\u20AC" + Math.round(v / 1e6) + "M"} tick={{ fontSize: 9, fill: "#94a3b8", fontWeight: 600 }} tickLine={false} axisLine={false} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 10, fill: "#475569", fontWeight: 700 }} tickLine={false} axisLine={false} />
                <Tooltip content={<BarTip />} cursor={{ fill: "rgba(99,102,241,.05)" }} wrapperStyle={{ zIndex: 1000, pointerEvents: "none" }} />
                <Bar dataKey="value" radius={[0, 9, 9, 0]} maxBarSize={22} isAnimationActive={false} style={{ filter: "url(#barLift)" }}>
                  {CITY_CAP.map((_, i) => (
                    <Cell key={i} fill={"url(#gb" + (i % CITY_HUES.length) + ")"} />
                  ))}
                  <LabelList dataKey="value" position="right" formatter={(v) => eur(v)} style={{ fontSize: 9.5, fill: "#64748b", fontWeight: 800 }} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-3 gap-x-3 gap-y-1.5 border-t border-slate-200/40 px-5 py-3">
            {CITY_CAP.slice(0, 6).map((c, i) => (
              <div key={c.name} className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: CITY_HUES[i % CITY_HUES.length], boxShadow: "0 0 5px " + CITY_HUES[i % CITY_HUES.length] }} />
                <span className="truncate font-semibold text-slate-500" style={{ fontSize: 9.5 }}>{c.name}</span>
                <span className="ml-auto font-bold tabular-nums text-slate-400" style={{ fontSize: 9.5 }}>{"\u20AC" + Math.round(c.value / 1e6) + "M"}</span>
              </div>
            ))}
          </div>
        </GlassCard>
        <GlassCard delay={0.46} className="flex flex-col overflow-hidden">
          <div className="px-5 pb-1 pt-6">
            <h3 className="font-black tracking-tighter text-slate-800" style={{ fontSize: 14 }}>Asset Class</h3>
            <p className="mt-1 text-slate-400" style={{ fontSize: 10 }}>Composizione tipologica</p>
          </div>
          <div className="flex flex-1 flex-col items-center justify-center px-5 pb-5">
            <div className="relative" style={{ width: 182, height: 182 }}>
              <div className="pointer-events-none absolute inset-0 rounded-full" style={{ background: "radial-gradient(circle,rgba(99,102,241,.14),transparent 62%)" }} />
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <defs>
                    {ALLOC.map((a, i) => (
                      <filter key={i} id={"pieGlow" + i} x="-50%" y="-50%" width="200%" height="200%">
                        <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor={a.glow} floodOpacity=".85" />
                      </filter>
                    ))}
                    {ALLOC.map((a, i) => (
                      <linearGradient key={"g" + i} id={"pieG" + i} x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor={a.glow} />
                        <stop offset="100%" stopColor={a.color} />
                      </linearGradient>
                    ))}
                  </defs>
                  <Pie data={allocDynamic} cx="50%" cy="50%" innerRadius={60} outerRadius={83} paddingAngle={4} dataKey="value" strokeWidth={0} isAnimationActive={false} onMouseEnter={(_, i) => setPieHover(i)} onMouseLeave={() => setPieHover(null)}>
                    {allocDynamic.map((a, i) => (
                      <Cell key={i} fill={"url(#pieG" + i + ")"} style={{ filter: pieHover === i ? "url(#pieGlow" + i + ")" : "none", opacity: pieHover === null || pieHover === i ? 1 : 0.34, transition: "opacity .35s ease" }} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-black tabular-nums text-slate-800" style={{ fontSize: 30, letterSpacing: "-.05em", lineHeight: 1 }}>{pieHover === null ? totalCount : allocDynamic[pieHover].value}</span>
                <span className="mt-1 font-bold uppercase tracking-[.22em] text-slate-400" style={{ fontSize: 8.5 }}>{pieHover === null ? "pratiche" : allocDynamic[pieHover].name}</span>
              </div>
            </div>
            <div className="mt-5 w-full space-y-2.5">
              {allocDynamic.map((it, i) => (
                <div key={it.name} onMouseEnter={() => setPieHover(i)} onMouseLeave={() => setPieHover(null)} className="flex cursor-pointer items-center gap-2.5 rounded-xl px-2 py-1.5 transition-colors duration-300" style={{ background: pieHover === i ? "rgba(99,102,241,.06)" : "transparent" }}>
                  <span className="h-2.5 w-2.5 shrink-0 rounded-md transition-shadow duration-300" style={{ background: "linear-gradient(135deg," + it.glow + "," + it.color + ")", boxShadow: pieHover === i ? "0 0 10px " + it.glow : "none" }} />
                  <span className="flex-1 font-semibold text-slate-600" style={{ fontSize: 11 }}>{it.name}</span>
                  <span className="font-black tabular-nums text-slate-800" style={{ fontSize: 12, letterSpacing: "-.02em" }}>{it.value}</span>
                  <span className="text-right font-bold tabular-nums text-slate-400" style={{ fontSize: 9.5, width: 38 }}>{totalCount ? ((it.value / totalCount) * 100).toFixed(1) : "0.0"}%</span>
                </div>
              ))}
            </div>
            <div className="mt-3 flex w-full items-baseline justify-between border-t border-slate-200/60 pt-3">
              <Eyebrow>Capital Density</Eyebrow>
              <span className="font-black tabular-nums text-indigo-600" style={{ fontSize: 12, letterSpacing: "-.02em" }}>{totalCount ? eur(Math.round(totalCap / totalCount)) : "—"} / pratica</span>
            </div>
          </div>
        </GlassCard>
      </div>
      <GlassCard delay={0.53} className="overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-200/40 px-6 pb-4 pt-6">
          <div>
            <h3 className="font-black tracking-tighter text-slate-800" style={{ fontSize: 14 }}>Top Deals</h3>
            <p className="mt-1 text-slate-400" style={{ fontSize: 10 }}>I 10 migliori asset per ROI atteso</p>
          </div>
        </div>
        <div className="scrollzone overflow-auto">
          <table className="w-full" style={{ borderCollapse: "separate", borderSpacing: 0, minWidth: 640 }}>
            <thead>
              <tr>
                {["Indirizzo", "Città", "Asset", "Valore", "ROI", "Status"].map((h, i) => (
                  <th key={i} className="border-b border-slate-200/60 bg-slate-50/80 text-left font-bold uppercase tracking-[.2em] text-slate-400 backdrop-blur-sm" style={{ fontSize: 8.5, padding: "10px 16px" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {allDeals.filter((d) => d.r > 10).slice(0, 10).map((row, idx) => (
                <tr key={row.id} onClick={() => onOpenDeal(row)} className="cursor-pointer transition-colors duration-150 hover:bg-indigo-500/[.04]" style={{ opacity: 0, animation: "rowIn .4s cubic-bezier(.22,1,.36,1) " + (0.6 + idx * 0.03) + "s forwards" }}>
                  <td className="border-b border-slate-100/80" style={{ padding: "11px 16px" }}>
                    <span className="block truncate font-semibold text-slate-700" style={{ fontSize: 11, maxWidth: 240 }} title={row.a}>{row.a}</span>
                  </td>
                  <td className="border-b border-slate-100/80" style={{ padding: "11px 16px" }}>
                    <span className="font-medium text-slate-400" style={{ fontSize: 10.5 }}>{row.city}</span>
                  </td>
                  <td className="border-b border-slate-100/80" style={{ padding: "11px 16px" }}><TypeChip t={row.t} /></td>
                  <td className="border-b border-slate-100/80" style={{ padding: "11px 16px" }}>
                    <span className="font-black tabular-nums text-slate-700" style={{ fontSize: 11.5, letterSpacing: "-.025em" }}>{eur(row.c)}</span>
                  </td>
                  <td className="border-b border-slate-100/80" style={{ padding: "11px 16px" }}><RoiChip r={row.r} /></td>
                  <td className="border-b border-slate-100/80" style={{ padding: "11px 16px" }}><StatusChip s={row.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
});

/* ══════ PORTFOLIO VIEW ══════ */
const PortfolioView = memo(({ onOpenDeal, quickFilter, compareIds, onToggleCompare, onOpenCompare, allDeals, onEditDeal, onDeleteDeal, onApproveDeal, onSuspendDeal }) => {
  const [tab, setTab] = useState("all");
  const [q, setQ] = useState("");
  const [dir, setDir] = useState("desc");
  const [menuRowId, setMenuRowId] = useState(null);
  const [hoverRow, setHoverRow] = useState(null);

  useEffect(() => {
    if (!quickFilter) return;
    if (quickFilter.type === "target") setTab("target");
    else if (quickFilter.type === "pos") setTab("pos");
    else if (quickFilter.type === "neg") setTab("neg");
    else if (quickFilter.type === "target20") { setTab("all"); setQ(""); }
    else if (["milano", "torino", "genova"].includes(quickFilter.type)) { setTab("all"); setQ(quickFilter.type); }
    else if (quickFilter.type === "terreno") { setTab("all"); setQ(""); }
  }, [quickFilter]);

  const rows = useMemo(() => {
    let d = allDeals;
    if (tab === "target") d = d.filter((x) => x.r > 10);
    else if (tab === "pos") d = d.filter((x) => x.r > 0);
    else if (tab === "neg") d = d.filter((x) => x.r <= 0);
    if (quickFilter?.type === "target20") d = d.filter((x) => x.r > 20);
    if (quickFilter?.type === "terreno") d = d.filter((x) => x.t === "Terreno");
    if (q.trim()) {
      const s = q.trim().toLowerCase();
      d = d.filter((x) => x.a.toLowerCase().includes(s) || x.city.toLowerCase().includes(s));
    }
    return [...d].sort((a, b) => (dir === "desc" ? b.r - a.r : a.r - b.r));
  }, [tab, q, dir, quickFilter, allDeals]);

  const PAGE_SIZE = 50;
  const [page, setPage] = useState(1);
  useEffect(() => { setPage(1); }, [tab, q, dir, quickFilter]);
  useEffect(() => setMenuRowId(null), [tab, q, dir]);
  const pageRows = rows.slice(0, page * PAGE_SIZE);
  const hasMore = pageRows.length < rows.length;

  const capF = rows.reduce((s, d) => s + d.c, 0);
  const roiF = rows.length ? rows.reduce((s, d) => s + d.r, 0) / rows.length : 0;

  return (
    <div className="flex h-full flex-col p-8">
      <div className="mb-6 flex items-center justify-between" style={{ opacity: 0, animation: "riseIn .5s cubic-bezier(.22,1,.36,1) .05s forwards" }}>
        <div>
          <h2 className="font-black tracking-tighter text-slate-800" style={{ fontSize: 22 }}>Portafoglio</h2>
          <p className="mt-1 text-slate-400" style={{ fontSize: 11 }}>{rows.length} pratiche · Capitale {eur(capF)}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-xl border border-white/70 bg-white/55 px-3 py-2 ring-1 ring-white/50 backdrop-blur-xl">
            <Search size={12} strokeWidth={1.5} className="text-slate-400" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cerca indirizzo, città…" className="bg-transparent text-slate-600 outline-none" style={{ fontSize: 11, width: 180 }} />
          </div>
          <div className="flex gap-0.5 rounded-xl bg-slate-500/[.06] p-1">
            {[["all", "Tutte"], ["target", "In Target"], ["pos", "Positive"], ["neg", "Negative"]].map(([id, l]) => (
              <button key={id} onClick={() => setTab(id)} className={"rounded-lg font-bold transition-all duration-300 " + (tab === id ? "ring-indigo-500/14 bg-white text-indigo-600 shadow-sm ring-1" : "text-slate-500 hover:text-slate-700")} style={{ fontSize: 10, padding: "5px 12px" }}>{l}</button>
            ))}
          </div>
          <button onClick={() => setDir((d) => (d === "desc" ? "asc" : "desc"))} className="flex items-center gap-1 rounded-xl border border-white/70 bg-white/60 font-bold text-slate-500 transition-all duration-200 hover:bg-white" style={{ fontSize: 10, padding: "6px 12px" }}>
            {dir === "desc" ? <ArrowDownRight size={11} strokeWidth={1.5} /> : <ArrowUpRight size={11} strokeWidth={1.5} />}
            ROI
          </button>
        </div>
      </div>

      {compareIds.length > 0 && (
        <div className="mb-4 flex items-center gap-3 rounded-2xl border border-indigo-200/50 px-4 py-2.5" style={{ background: "linear-gradient(135deg,rgba(99,102,241,.09),rgba(139,92,246,.05))", animation: "riseIn .3s cubic-bezier(.22,1,.36,1) forwards" }}>
          <Scale size={14} strokeWidth={1.6} className="text-indigo-500" />
          <span className="font-bold text-indigo-700" style={{ fontSize: 11.5 }}>{compareIds.length} pratich{compareIds.length === 1 ? "a selezionata" : "e selezionate"} per il confronto</span>
          <span className="text-slate-400" style={{ fontSize: 10 }}>(max 3)</span>
          <button onClick={onOpenCompare} disabled={compareIds.length < 2} className="ml-auto flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-bold text-white transition-opacity" style={{ fontSize: 10.5, background: "linear-gradient(140deg,#6366f1,#7c3aed)", opacity: compareIds.length < 2 ? 0.4 : 1, cursor: compareIds.length < 2 ? "not-allowed" : "pointer" }}>
            Confronta
            <ArrowUpRight size={11} strokeWidth={1.8} />
          </button>
          <button onClick={() => compareIds.forEach((id) => onToggleCompare(id))} className="rounded-lg px-2.5 py-1.5 font-semibold text-slate-500 transition-colors hover:bg-white/60" style={{ fontSize: 10.5 }}>Svuota</button>
        </div>
      )}

      <GlassCard delay={0.15} className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <div className="scrollzone flex-1 overflow-auto">
          <table className="w-full" style={{ borderCollapse: "separate", borderSpacing: 0, minWidth: 820 }}>
            <thead className="sticky top-0 z-[6]">
              <tr>
                <th className="border-b border-slate-200/70 bg-slate-50/90 text-left backdrop-blur-sm" style={{ padding: "11px 12px 11px 16px", width: 36 }} />
                {["Indirizzo", "Città", "Asset", "Valore", "ROI", "Status", ""].map((h, i) => (
                  <th key={i} className="border-b border-slate-200/70 bg-slate-50/90 text-left font-bold uppercase tracking-[.2em] text-slate-400 backdrop-blur-sm" style={{ fontSize: 8.5, padding: "11px 16px" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pageRows.map((row, idx) => {
                const hov = hoverRow === row.id;
                const checked = compareIds.includes(row.id);
                const disabled = !checked && compareIds.length >= 3;
                return (
                  <tr key={row.id} onClick={() => onOpenDeal(row)} onMouseEnter={() => setHoverRow(row.id)} onMouseLeave={() => setHoverRow(null)} className="cursor-pointer transition-colors duration-150" style={{ opacity: 0, animation: "rowIn .4s cubic-bezier(.22,1,.36,1) " + (0.2 + Math.min(idx, 30) * 0.018) + "s forwards" }}>
                    <td style={{ padding: "11px 12px 11px 16px", borderBottom: "1px solid rgba(241,245,249,.85)", background: hov || checked ? "rgba(99,102,241,.045)" : "transparent" }} onClick={(e) => e.stopPropagation()}>
                      <button onClick={() => !disabled && onToggleCompare(row.id)} disabled={disabled} className="flex items-center justify-center rounded-md border transition-all duration-150" style={{ width: 17, height: 17, borderColor: checked ? "#6366f1" : "rgba(148,163,184,.5)", background: checked ? "#6366f1" : "transparent", opacity: disabled ? 0.35 : 1, cursor: disabled ? "not-allowed" : "pointer" }} title={disabled ? "Massimo 3 pratiche per confronto" : "Seleziona per confronto"}>
                        {checked && <Check size={11} strokeWidth={3} className="text-white" />}
                      </button>
                    </td>
                    {[
                      <span className="block truncate font-semibold text-slate-700" style={{ fontSize: 11, maxWidth: 260 }} title={row.a}>{row.a}</span>,
                      <span className="font-medium text-slate-400" style={{ fontSize: 10.5 }}>{row.city}</span>,
                      <span className="flex items-center gap-1.5"><TypeChip t={row.t} />{row.source === "manual" && <span className="inline-flex items-center rounded-md font-bold tracking-wide ring-1 bg-amber-50 text-amber-700 ring-amber-500/20" style={{ fontSize: 9.5, padding: "2px 7px" }}>Manuale</span>}{row.source === "imported-xlsx" && <span className="inline-flex items-center rounded-md font-bold tracking-wide ring-1 bg-blue-50 text-blue-700 ring-blue-500/20" style={{ fontSize: 9.5, padding: "2px 7px" }}>Importato</span>}</span>,
                      <span className="font-black tabular-nums text-slate-700" style={{ fontSize: 11.5, letterSpacing: "-.025em" }}>{eur(row.c)}</span>,
                      <RoiChip r={row.r} />,
                      <StatusChip s={row.status} />,
                    ].map((cell, ci) => (
                      <td key={ci} style={{ padding: "11px 16px", whiteSpace: "nowrap", verticalAlign: "middle", opacity: row.r <= 0 ? 0.5 : 1, borderBottom: "1px solid rgba(241,245,249,.85)", background: checked ? "rgba(99,102,241,.06)" : hov ? "rgba(99,102,241,.038)" : "transparent", boxShadow: hov || checked ? "inset 3px 0 0 0 rgba(99,102,241,.55)" : "none", transition: "background .22s ease,box-shadow .22s ease" }}>{cell}</td>
                    ))}
                    <td style={{ padding: "11px 12px", whiteSpace: "nowrap", borderBottom: "1px solid rgba(241,245,249,.85)", background: checked ? "rgba(99,102,241,.06)" : hov ? "rgba(99,102,241,.038)" : "transparent", transition: "background .22s ease" }} onClick={(e) => e.stopPropagation()}>
                      <RowMenu row={row} isOpen={menuRowId === row.id} isRowHovered={hov} onToggle={() => setMenuRowId((cur) => (cur === row.id ? null : row.id))} onCloseMenu={() => setMenuRowId(null)} onOpenDeal={onOpenDeal} isManual={row.source === "manual" || row.source === "imported-xlsx"} onEdit={() => onEditDeal?.(row)} onDelete={() => onDeleteDeal?.(row.id)} onApprove={(r) => onApproveDeal?.(r)} onSuspend={(r) => onSuspendDeal?.(r)} />
                    </td>
                  </tr>
                );
              })}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-12 text-center font-semibold text-slate-400" style={{ fontSize: 12 }}>Nessuna pratica corrisponde ai filtri.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex shrink-0 items-center justify-between border-t border-slate-200/40 bg-slate-50/50 px-6 py-3.5">
          <span className="text-slate-400" style={{ fontSize: 10 }}>
            Mostrando <strong className="font-black tabular-nums text-slate-600">{pageRows.length}</strong> di <strong className="font-black tabular-nums text-slate-600">{rows.length}</strong>
            {hasMore && (
              <button onClick={() => setPage((p) => p + 1)} className="ml-3 font-bold text-indigo-500 underline underline-offset-2 hover:text-indigo-700" style={{ fontSize: 10 }}>
                Carica altri {Math.min(PAGE_SIZE, rows.length - pageRows.length)}
              </button>
            )}
          </span>
          <div className="flex gap-6">
            <span className="text-slate-400" style={{ fontSize: 10 }}>Capitale <strong className="font-black tabular-nums tracking-tight text-slate-700">{eur(capF)}</strong></span>
            <span className="text-slate-400" style={{ fontSize: 10 }}>ROI medio <strong className="font-black tabular-nums tracking-tight" style={{ color: roiF >= 0 ? "#2563eb" : "#db2777" }}>{roiF > 0 ? "+" : ""}{roiF.toFixed(1)}%</strong></span>
          </div>
        </div>
      </GlassCard>
    </div>
  );
});

/* ══════ MAP VIEW ══════ */
const GOOGLE_MAPS_API_KEY = "AIzaSyBfgX2TONVW5TxXWlEqFvZ1px1Hk6gGZBE";

function loadGoogleMaps(apiKey) {
  if (window.google?.maps) return Promise.resolve(window.google.maps);
  if (window.__gmapsLoadingPromise) return window.__gmapsLoadingPromise;
  window.__gmapsLoadingPromise = new Promise((resolve, reject) => {
    // loading=async requires callback param — onload fires before google.maps is ready
    window.__gmapsInitCb = () => resolve(window.google.maps);
    const script = document.createElement("script");
    script.src = "https://maps.googleapis.com/maps/api/js?key=" + apiKey + "&callback=__gmapsInitCb&loading=async";
    script.async = true;
    script.onerror = () => reject(new Error("Impossibile caricare Google Maps"));
    document.head.appendChild(script);
  });
  return window.__gmapsLoadingPromise;
}

const MapView = memo(({ onOpenDeal, allDeals, onCityFilter }) => {
  const cities = MAP_CITIES.map((m, i) => ({
    ...m,
    deals: allDeals.filter((d) => d.city === m.name).length,
    cap: allDeals.filter((d) => d.city === m.name).reduce((s, d) => s + d.c, 0),
    hue: CITY_HUES[i % CITY_HUES.length],
  })).filter((c) => c.deals > 0);
  const mapRef = useRef(null);
  const [status, setStatus] = useState("loading");
  const statusRef = useRef("loading");

  useEffect(() => {
    let cancelled = false;
    // Use ref to avoid stale closure — timeout must not fire after map loads
    const timeout = setTimeout(() => {
      if (!cancelled && statusRef.current === "loading") setStatus("error");
    }, 15000);
    loadGoogleMaps(GOOGLE_MAPS_API_KEY)
      .then((maps) => {
        if (cancelled || !mapRef.current) return;
        clearTimeout(timeout);
        const map = new maps.Map(mapRef.current, {
          center: { lat: 44.2, lng: 9.8 },
          zoom: 6.4,
          disableDefaultUI: true,
          zoomControl: true,
          // styles require no mapId
          styles: [
            { elementType: "geometry", stylers: [{ color: "#f6f7fb" }] },
            { elementType: "labels.text.fill", stylers: [{ color: "#64748b" }] },
            { featureType: "water", stylers: [{ color: "#c7d2fe" }] },
            { featureType: "road", stylers: [{ color: "#e2e8f0" }] },
          ],
        });
        // one marker per deal using individual coordinates; fall back to city-based offset for manual/imported deals
        const cityCount = {};
        allDeals.forEach((deal) => {
          let pos;
          if (deal.lat && deal.lng) {
            pos = { lat: deal.lat, lng: deal.lng };
          } else {
            const base = CITY_COORDS[deal.city] || CITY_COORDS["Altro"];
            const idx = (cityCount[deal.city] = (cityCount[deal.city] ?? 0) + 1) - 1;
            const angle = idx * 2.4;
            const radius = idx === 0 ? 0 : 0.012 + 0.008 * Math.floor(idx / 7);
            pos = { lat: base.lat + radius * Math.cos(angle), lng: base.lng + radius * Math.sin(angle) };
          }
          const roiColor = deal.r >= 15 ? "#10b981" : deal.r >= 0 ? "#6366f1" : "#f43f5e";
          const marker = new maps.Marker({
            position: pos,
            map,
            title: deal.a,
            icon: { path: maps.SymbolPath.CIRCLE, scale: 8, fillColor: roiColor, fillOpacity: 0.92, strokeColor: "#fff", strokeWeight: 2 },
          });
          const info = new maps.InfoWindow({
            content:
              '<div style="font-family:-apple-system,sans-serif;padding:3px 5px;min-width:160px">' +
              '<strong style="font-size:12px;color:#0f172a">' + deal.a + '</strong><br/>' +
              '<span style="color:#64748b;font-size:11px">' + deal.t + " · " + eur(deal.c) + '</span><br/>' +
              '<span style="font-size:11px;font-weight:700;color:' + roiColor + '">' + (deal.r >= 0 ? "+" : "") + deal.r.toFixed(1) + "% ROI</span>" +
              '</div>',
          });
          marker.addListener("click", () => {
            info.open(map, marker);
            onOpenDeal?.(deal);
          });
        });
        if (!cancelled) { statusRef.current = "ready"; setStatus("ready"); }
      })
      .catch(() => { if (!cancelled) setStatus("error"); });
    return () => { cancelled = true; clearTimeout(timeout); };
  }, []);

  return (
    <div className="flex flex-col p-8">
      <div style={{ opacity: 0, animation: "riseIn .5s cubic-bezier(.22,1,.36,1) .05s forwards" }}>
        <h2 className="font-black tracking-tighter text-slate-800" style={{ fontSize: 22 }}>Mappa Asset</h2>
        <p className="mt-1 text-slate-400" style={{ fontSize: 11 }}>Distribuzione geografica del portafoglio — Google Maps JavaScript API</p>
      </div>
      <GlassCard delay={0.15} className="relative mt-6 min-h-[560px] overflow-hidden">
        <div ref={mapRef} className="absolute inset-0" style={{ opacity: status === "ready" ? 1 : 0, transition: "opacity .4s ease" }} />
        {status !== "ready" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-slate-100 to-slate-200/80 px-8 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/60 bg-white/70 backdrop-blur-lg">
              {status === "loading" ? <Sparkles size={20} className="text-indigo-500" style={{ animation: "pulseGlow 1.4s ease-in-out infinite" }} /> : <Globe size={20} className="text-indigo-500" />}
            </div>
            <p className="font-black text-slate-700" style={{ fontSize: 13 }}>{status === "loading" ? "Caricamento Google Maps…" : "Google Maps non disponibile in questo ambiente"}</p>
            <p className="max-w-md text-slate-400" style={{ fontSize: 11, lineHeight: 1.6 }}>{status === "loading" ? "Caricamento in corso…" : "Impossibile caricare Google Maps. Verifica che la chiave API sia abilitata per Maps JavaScript API e che il dominio elekta-re.web.app sia autorizzato in Google Cloud Console."}</p>
          </div>
        )}
        <div className="absolute right-4 top-4 z-10 flex flex-col items-end gap-1.5">
          {cities.map((c, i) => (
            <button
              key={c.name}
              onClick={() => onCityFilter?.(c.name)}
              title={`Filtra portfolio per ${c.name}`}
              className="flex items-center gap-2 rounded-xl border border-white/70 bg-white/85 px-3 py-1.5 backdrop-blur-xl transition-all duration-200 hover:-translate-y-px hover:bg-white hover:shadow-md"
              style={{ boxShadow: "0 4px 16px -4px rgba(15,23,42,.18)", opacity: 0, animation: "riseIn .5s cubic-bezier(.22,1,.36,1) " + (0.3 + i * 0.08) + "s forwards" }}
            >
              <span className="h-2 w-2 rounded-full" style={{ background: c.hue, boxShadow: "0 0 6px " + c.hue }} />
              <span className="font-black text-slate-700" style={{ fontSize: 10.5 }}>{c.name}</span>
              <span className="font-bold tabular-nums text-slate-400" style={{ fontSize: 9.5 }}>{c.deals} deal</span>
            </button>
          ))}
        </div>
      </GlassCard>
    </div>
  );
});

/* ══════ REPORT VIEW ══════ */
const ReportView = memo(({ allDeals, generatedReports, onGenerateReport }) => {
  const handleGenerate = () => {
    const topDeals = [...allDeals].sort((a, b) => b.r - a.r).slice(0, 5);
    printDeals(topDeals);
    onGenerateReport?.({
      title: "Top 5 Deal per ROI — " + new Date().toLocaleDateString("it-IT", { day: "2-digit", month: "short", year: "numeric" }),
      date: new Date().toLocaleDateString("it-IT", { day: "2-digit", month: "long", year: "numeric" }),
      count: topDeals.length,
    });
  };
  return (
    <div className="p-8">
      <div style={{ opacity: 0, animation: "riseIn .5s cubic-bezier(.22,1,.36,1) .05s forwards" }}>
        <h2 className="font-black tracking-tighter text-slate-800" style={{ fontSize: 22 }}>Report</h2>
        <p className="mt-1 text-slate-400" style={{ fontSize: 11 }}>Esporta analisi del portafoglio in PDF</p>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-5">
        <GlassCard delay={0.15} className="group cursor-pointer overflow-hidden border-dashed border-indigo-300/40" hover onClick={handleGenerate}>
          <div className="flex h-48 flex-col items-center justify-center p-8 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110" style={{ background: "linear-gradient(140deg,#6366f1,#8b5cf6)", boxShadow: "0 8px 24px -6px rgba(99,102,241,.6)" }}>
              <Sparkles size={22} className="text-white" />
            </div>
            <p className="font-black tracking-tight text-slate-800" style={{ fontSize: 14 }}>Genera Nuovo Report</p>
            <p className="mt-1 text-slate-400" style={{ fontSize: 10 }}>Top 5 deal per ROI · esportazione PDF immediata</p>
          </div>
        </GlassCard>
        <GlassCard delay={0.22} className="overflow-hidden">
          <div className="px-5 pb-2 pt-5"><Eyebrow>Report Generati</Eyebrow></div>
          <div className="px-2 pb-3">
            {generatedReports.length === 0 ? (
              <div className="flex flex-col items-center gap-2 px-4 py-8 text-center">
                <FileText size={22} className="text-slate-300" />
                <p className="font-semibold text-slate-400" style={{ fontSize: 11 }}>Nessun report generato</p>
                <p className="text-slate-300" style={{ fontSize: 10 }}>Usa il pulsante a sinistra per crearne uno</p>
              </div>
            ) : (
              generatedReports.map((r, i) => (
                <div key={i} className="flex items-center gap-3 rounded-xl px-3 py-3" style={{ opacity: 0, animation: "riseIn .4s cubic-bezier(.22,1,.36,1) " + (0.3 + i * 0.06) + "s forwards" }}>
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/10"><FileBarChart size={16} className="text-indigo-500" /></div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-bold text-slate-700" style={{ fontSize: 11 }}>{r.title}</p>
                    <p className="text-slate-400" style={{ fontSize: 9.5 }}>{r.date} · {r.count} deal</p>
                  </div>
                  <span className="rounded-md bg-blue-500/10 font-bold text-blue-700 ring-1 ring-blue-500/20" style={{ fontSize: 9, padding: "2px 7px" }}>PDF</span>
                </div>
              ))
            )}
          </div>
        </GlassCard>
      </div>
    </div>
  );
});

/* ══════ SETTINGS VIEW ══════ */
const SettingsView = memo(({ profile, onSaveProfile, allDeals }) => {
  const [editingField, setEditingField] = useState(null);
  const [draft, setDraft] = useState(profile);
  useEffect(() => { setDraft(profile); }, [profile]);

  const handleSave = () => { onSaveProfile(draft); setEditingField(null); };

  const totalDeals = allDeals.length;
  const manualCount = allDeals.filter((d) => d.source === "manual").length;
  const importedCount = allDeals.filter((d) => d.source === "imported-xlsx").length;

  return (
    <div className="p-8">
      <div style={{ opacity: 0, animation: "riseIn .5s cubic-bezier(.22,1,.36,1) .05s forwards" }}>
        <h2 className="font-black tracking-tighter text-slate-800" style={{ fontSize: 22 }}>Impostazioni</h2>
        <p className="mt-1 text-slate-400" style={{ fontSize: 11 }}>Configurazione terminale e profilo</p>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-5">
        {/* Profilo — editabile */}
        <GlassCard delay={0.12} className="overflow-hidden" hover>
          <div className="p-5">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10"><User size={18} className="text-indigo-500" /></div>
              <div>
                <p className="font-black tracking-tight text-slate-800" style={{ fontSize: 13 }}>Profilo</p>
                <p className="text-slate-400" style={{ fontSize: 10 }}>Clicca un campo per modificarlo</p>
              </div>
            </div>
            <div className="space-y-2">
              {[["name", "Nome", draft.name], ["role", "Ruolo", draft.role]].map(([field, label, val]) => (
                <div key={field} className="rounded-lg bg-slate-500/[.04] px-3 py-1.5">
                  {editingField === field ? (
                    <div className="flex items-center gap-2">
                      <span className="shrink-0 font-bold text-slate-400" style={{ fontSize: 9.5 }}>{label}:</span>
                      <input
                        value={draft[field]}
                        onChange={(e) => setDraft((p) => ({ ...p, [field]: e.target.value }))}
                        onKeyDown={(e) => { if (e.key === "Enter") handleSave(); if (e.key === "Escape") setEditingField(null); }}
                        onBlur={handleSave}
                        autoFocus
                        className="flex-1 bg-transparent text-slate-700 outline-none"
                        style={{ fontSize: 10.5 }}
                      />
                    </div>
                  ) : (
                    <div className="flex cursor-text items-center gap-2" onClick={() => setEditingField(field)}>
                      <span className="h-1 w-1 rounded-full bg-indigo-400" />
                      <span className="font-medium text-slate-600" style={{ fontSize: 10.5 }}>{label}: <strong>{val || "—"}</strong></span>
                      <Pencil size={9} className="ml-auto text-slate-300" />
                    </div>
                  )}
                </div>
              ))}
              <div className="flex items-center gap-2 rounded-lg bg-slate-500/[.04] px-3 py-1.5">
                <span className="h-1 w-1 rounded-full bg-indigo-400" />
                <span className="font-medium text-slate-600" style={{ fontSize: 10.5 }}>Team: <strong>Elekta RE</strong></span>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Dati — info reali */}
        <GlassCard delay={0.20} className="overflow-hidden" hover>
          <div className="p-5">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10"><Database size={18} className="text-indigo-500" /></div>
              <div>
                <p className="font-black tracking-tight text-slate-800" style={{ fontSize: 13 }}>Dataset</p>
                <p className="text-slate-400" style={{ fontSize: 10 }}>Pratiche caricate in sessione</p>
              </div>
            </div>
            <div className="space-y-2">
              {[
                ["Pratiche totali", totalDeals.toString()],
                ["Aggiunte manualmente", manualCount.toString()],
                ["Importate da Excel", importedCount.toString()],
              ].map(([label, val]) => (
                <div key={label} className="flex items-center gap-2 rounded-lg bg-slate-500/[.04] px-3 py-1.5">
                  <span className="h-1 w-1 rounded-full bg-indigo-400" />
                  <span className="font-medium text-slate-600" style={{ fontSize: 10.5 }}>{label}: <strong>{val}</strong></span>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>

        {/* Sicurezza — non configurabile in locale */}
        <GlassCard delay={0.28} className="overflow-hidden" hover>
          <div className="p-5">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-400/10"><Shield size={18} className="text-slate-400" /></div>
              <div>
                <p className="font-black tracking-tight text-slate-800" style={{ fontSize: 13 }}>Sicurezza</p>
                <p className="text-slate-400" style={{ fontSize: 10 }}>Autenticazione e permessi</p>
              </div>
            </div>
            <div className="rounded-lg border border-dashed border-slate-200 px-3 py-3 text-center">
              <p className="font-semibold text-slate-400" style={{ fontSize: 10.5 }}>Configurazione disponibile in produzione</p>
              <p className="mt-1 text-slate-300" style={{ fontSize: 9.5 }}>2FA, SSO, gestione sessioni</p>
            </div>
          </div>
        </GlassCard>

        {/* Integrazioni */}
        <GlassCard delay={0.36} className="overflow-hidden" hover>
          <div className="p-5">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10"><Wifi size={18} className="text-indigo-500" /></div>
              <div>
                <p className="font-black tracking-tight text-slate-800" style={{ fontSize: 13 }}>Integrazioni</p>
                <p className="text-slate-400" style={{ fontSize: 10 }}>API e servizi connessi</p>
              </div>
            </div>
            <div className="space-y-2">
              {[
                ["Google Maps API", "Attiva"],
                ["Export PDF", "Attivo"],
                ["Import Excel (.xlsx)", "Attivo"],
              ].map(([label, val]) => (
                <div key={label} className="flex items-center gap-2 rounded-lg bg-slate-500/[.04] px-3 py-1.5">
                  <span className="h-1 w-1 rounded-full bg-emerald-400" />
                  <span className="font-medium text-slate-600" style={{ fontSize: 10.5 }}>{label}: <strong className="text-emerald-600">{val}</strong></span>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
});

/* ══════════════════════════════════════════════════════════════════
   ROOT
   ══════════════════════════════════════════════════════════════════ */
export default function ElektaTerminal() {
  const { user, signIn, signUp } = useFirebaseAuth();

  // user === undefined → still resolving auth state → show spinner
  if (user === undefined) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ background: "#f6f7fb" }}>
        <style>{GLOBAL_CSS}</style>
        <span className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-500" />
      </div>
    );
  }

  // Not authenticated → show login
  if (!user) {
    return <LoginScreen signIn={signIn} signUp={signUp} />;
  }

  return <AuthenticatedApp />;
}

function AuthenticatedApp() {
  const { loading } = usePortfolioData();
  const { allDeals: persistedDeals, manualDeals, addDeal, deleteDeal, updateDeal, setStatus } = usePersistentDeals();
  const [importedDeals, setImportedDeals] = useState([]);
  const allDeals = useMemo(() => [...persistedDeals, ...importedDeals], [persistedDeals, importedDeals]);

  const [profile, setProfileState] = useState(() => {
    try { return JSON.parse(localStorage.getItem("elekta_profile") || '{"name":"Luca Pipia","role":"Investment Analyst"}'); }
    catch { return { name: "Luca Pipia", role: "Investment Analyst" }; }
  });
  const saveProfile = useCallback((p) => {
    setProfileState(p);
    try { localStorage.setItem("elekta_profile", JSON.stringify(p)); } catch {}
  }, []);

  const [generatedReports, setGeneratedReports] = useState(() => {
    try { return JSON.parse(localStorage.getItem("elekta_reports") || "[]"); }
    catch { return []; }
  });
  const addReport = useCallback((r) => {
    setGeneratedReports((prev) => {
      const updated = [r, ...prev].slice(0, 10);
      try { localStorage.setItem("elekta_reports", JSON.stringify(updated)); } catch {}
      return updated;
    });
  }, []);

  const { signOut: fbSignOut } = useFirebaseAuth();

  const handleLogout = useCallback(async () => {
    ["elekta_manual_deals", "elekta_overrides", "elekta_profile", "elekta_reports"].forEach((k) => {
      try { localStorage.removeItem(k); } catch {}
    });
    try { await fbSignOut(); } catch {}
    window.location.reload();
  }, [fbSignOut]);

  const [nav, setNav] = useState("dashboard");
  const [activeDeal, setActiveDeal] = useState(null);
  const [drawerClosing, setDrawerClosing] = useState(false);

  const [newDealOpen, setNewDealOpen] = useState(false);
  const [newDealClosing, setNewDealClosing] = useState(false);
  const [editDeal, setEditDeal] = useState(null);
  const [toastMsg, setToastMsg] = useState(null);
  const [importLoading, setImportLoading] = useState(false);
  const importRef = useRef(null);

  const [compareIds, setCompareIds] = useState([]);
  const [compareOpen, setCompareOpen] = useState(false);
  const [compareClosing, setCompareClosing] = useState(false);

  const [paletteOpen, setPaletteOpen] = useState(false);
  const [quickFilter, setQuickFilter] = useState(null);

  const openDeal = useCallback((row) => { setDrawerClosing(false); setActiveDeal(row); }, []);
  const requestClose = useCallback(() => setDrawerClosing(true), []);
  const finishClose = useCallback(() => { setActiveDeal(null); setDrawerClosing(false); }, []);

  const openNewDeal = useCallback(() => { setEditDeal(null); setNewDealClosing(false); setNewDealOpen(true); }, []);
  const requestCloseNewDeal = useCallback(() => setNewDealClosing(true), []);
  const finishCloseNewDeal = useCallback(() => { setNewDealOpen(false); setNewDealClosing(false); setEditDeal(null); }, []);

  const handleSubmitDeal = useCallback((fields) => {
    if (editDeal) {
      updateDeal(editDeal.id, fields);
      setToastMsg("Pratica modificata con successo");
    } else {
      addDeal(fields);
      setToastMsg("Pratica aggiunta con successo");
    }
  }, [editDeal, addDeal, updateDeal]);

  const handleEditDeal = useCallback((deal) => {
    setEditDeal(deal);
    setNewDealClosing(false);
    setNewDealOpen(true);
    if (activeDeal) setDrawerClosing(true);
  }, [activeDeal]);

  const handleDeleteDeal = useCallback((id) => { deleteDeal(id); setToastMsg("Pratica rimossa"); }, [deleteDeal]);

  const handleApproveDeal = useCallback((deal) => {
    setStatus(deal.id, "Approvato");
    setToastMsg("Deal approvato");
    if (activeDeal?.id === deal.id) setActiveDeal((d) => ({ ...d, status: "Approvato" }));
  }, [setStatus, activeDeal]);

  const handleSuspendDeal = useCallback((deal) => {
    setStatus(deal.id, "In Revisione");
    setToastMsg("Deal sospeso — In Revisione");
    if (activeDeal?.id === deal.id) setActiveDeal((d) => ({ ...d, status: "In Revisione" }));
  }, [setStatus, activeDeal]);

  const handleImportExcel = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.name.match(/\.(xlsx|xls)$/i)) {
      setToastMsg("Errore: il file deve essere .xlsx o .xls");
      e.target.value = "";
      return;
    }
    setImportLoading(true);
    const reader = new FileReader();
    reader.onerror = () => { setToastMsg("Errore: impossibile leggere il file"); setImportLoading(false); };
    reader.onload = (ev) => {
      try {
        const XLSX = window.XLSX;
        if (!XLSX) { setToastMsg("SheetJS non disponibile — aggiungi <script src=\"https://cdn.sheetjs.com/xlsx-latest/package/dist/xlsx.full.min.js\"> all'index.html"); setImportLoading(false); return; }
        const wb = XLSX.read(ev.target.result, { type: "array" });
        if (!wb.SheetNames.length) throw new Error("File Excel vuoto o corrotto");
        const ws = wb.Sheets[wb.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(ws, { defval: "" });
        if (!rows.length) throw new Error("Nessuna riga trovata nel foglio");
        const parsed = rows
          .map((row, idx) => {
            const a = String(row.Indirizzo || row.a || "").trim();
            const t = String(row.Tipo || row.t || "Stabili").trim();
            const c = Number(row.Costo || row.c || 0);
            const r = Number(row.ROI || row.r || 0);
            if (!a || c <= 0) return null;
            return { a, t: ["Stabili","Terreno"].includes(t) ? t : "Stabili", c, r, note: String(row.Note || row.note || ""), id: "xlsx-" + Date.now() + "-" + idx, source: "imported-xlsx", city: cityOf(a), status: statusOf(r) };
          })
          .filter(Boolean);
        if (!parsed.length) throw new Error("Nessuna riga valida (richiede colonne: Indirizzo, Costo > 0)");
        setImportedDeals((prev) => [...prev, ...parsed]);
        setToastMsg(`${parsed.length} pratiche importate da "${file.name}"`);
      } catch (err) {
        setToastMsg("Errore import: " + (err.message || "file non valido"));
      } finally {
        setImportLoading(false);
        e.target.value = "";
      }
    };
    reader.readAsArrayBuffer(file);
  }, []);

  const toggleCompare = useCallback((id) => {
    setCompareIds((cur) => {
      if (cur.includes(id)) return cur.filter((x) => x !== id);
      if (cur.length >= 3) return cur;
      return [...cur, id];
    });
  }, []);
  const openCompare = useCallback(() => { setCompareClosing(false); setCompareOpen(true); }, []);
  const requestCloseCompare = useCallback(() => setCompareClosing(true), []);
  const finishCloseCompare = useCallback(() => { setCompareOpen(false); setCompareClosing(false); }, []);

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const applyQuickFilter = useCallback((type) => { setNav("portfolio"); setQuickFilter({ type, ts: Date.now() }); }, []);
  const handleCityFilter = useCallback((cityName) => { applyQuickFilter(cityName.toLowerCase()); }, [applyQuickFilter]);

  const compareDeals = useMemo(() => compareIds.map((id) => allDeals.find((d) => d.id === id)).filter(Boolean), [compareIds, allDeals]);

  const NAV_ITEMS = [
    { k: "dashboard", I: LayoutDashboard, l: "Dashboard" },
    { k: "portfolio", I: Briefcase, l: "Portafoglio" },
    { k: "map", I: Map, l: "Mappa" },
    { k: "report", I: FileText, l: "Report" },
    { k: "settings", I: Settings, l: "Impostazioni" },
  ];
  const VIEW_TITLES = { dashboard: "Dashboard", portfolio: "Portafoglio", map: "Mappa Asset", report: "Report", settings: "Impostazioni" };

  const renderView = () => {
    switch (nav) {
      case "dashboard": return <DashboardView onOpenDeal={openDeal} allDeals={allDeals} />;
      case "portfolio": return <PortfolioView onOpenDeal={openDeal} quickFilter={quickFilter} compareIds={compareIds} onToggleCompare={toggleCompare} onOpenCompare={openCompare} allDeals={allDeals} onEditDeal={handleEditDeal} onDeleteDeal={handleDeleteDeal} onApproveDeal={handleApproveDeal} onSuspendDeal={handleSuspendDeal} />;
      case "map": return <MapView onOpenDeal={openDeal} allDeals={allDeals} onCityFilter={handleCityFilter} />;
      case "report": return <ReportView allDeals={allDeals} generatedReports={generatedReports} onGenerateReport={addReport} />;
      case "settings": return <SettingsView profile={profile} onSaveProfile={saveProfile} allDeals={allDeals} />;
      default: return <DashboardView onOpenDeal={openDeal} allDeals={allDeals} />;
    }
  };

  return (
    <div className="relative flex h-screen overflow-hidden text-slate-700 antialiased" style={{ fontFamily: "-apple-system,BlinkMacSystemFont,'SF Pro Display',Inter,sans-serif", background: "#f6f7fb" }}>
      <style>{GLOBAL_CSS}</style>
      <div id="print-root" style={{ display: "none" }} />
      <style>{`@media print{ #print-root{ display:block !important; } }`}</style>

      <div className="pointer-events-none fixed inset-0 z-0 no-print">
        <div className="absolute" style={{ top: -160, left: "16%", width: 620, height: 620, background: "radial-gradient(circle,rgba(99,102,241,.11),transparent 62%)" }} />
        <div className="absolute" style={{ top: "34%", right: -180, width: 560, height: 560, background: "radial-gradient(circle,rgba(16,185,129,.085),transparent 64%)" }} />
        <div className="absolute" style={{ bottom: -190, left: "42%", width: 520, height: 520, background: "radial-gradient(circle,rgba(139,92,246,.075),transparent 66%)" }} />
      </div>

      <aside className="no-print relative z-20 flex w-16 shrink-0 flex-col items-center gap-2 border-r border-white/60 bg-white/60 py-5 backdrop-blur-3xl">
        <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-2xl" style={{ background: "linear-gradient(140deg,#6366f1,#8b5cf6)", boxShadow: "0 8px 22px -6px rgba(99,102,241,.7), inset 0 1px 0 rgba(255,255,255,.3)" }}>
          <span className="font-black text-white" style={{ fontSize: 13, letterSpacing: "-.04em" }}>E</span>
        </div>
        {NAV_ITEMS.map(({ k, I, l }) => {
          const on = nav === k;
          return (
            <button key={k} title={l} onClick={() => setNav(k)} className={"relative flex h-10 w-10 items-center justify-center rounded-2xl transition-all duration-300 " + (on ? "text-indigo-600" : "text-slate-400 hover:bg-slate-100/80 hover:text-slate-600")} style={{ background: on ? "rgba(99,102,241,.10)" : "transparent", boxShadow: on ? "inset 0 0 0 1px rgba(99,102,241,.20),0 3px 12px -4px rgba(99,102,241,.35)" : "none" }}>
              <I size={16} strokeWidth={1.5} />
              {on && <span className="absolute rounded-r-full" style={{ left: -12, top: "50%", transform: "translateY(-50%)", width: 3, height: 18, background: "linear-gradient(180deg,#6366f1,#8b5cf6)", boxShadow: "0 0 10px rgba(99,102,241,.8)" }} />}
            </button>
          );
        })}
        <div className="mt-auto flex flex-col items-center gap-3">
          <NotificationBell manualDeals={manualDeals} />
          <UserMenu profile={profile} onSaveProfile={saveProfile} onLogout={handleLogout} />
        </div>
      </aside>

      <div className="no-print relative z-10 flex min-w-0 flex-1 flex-col overflow-hidden">
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-white/60 bg-white/60 px-6 backdrop-blur-3xl">
          <div className="flex items-center gap-3">
            <h1 className="font-black tracking-tighter text-slate-800" style={{ fontSize: 15 }}>Investment Terminal</h1>
            <span className="h-4 w-px bg-slate-300/80" />
            <span className="font-semibold text-slate-400" style={{ fontSize: 11 }}>{VIEW_TITLES[nav]}</span>
          </div>
          <div className="flex items-center gap-2.5">
            <button onClick={() => setPaletteOpen(true)} className="flex items-center gap-2 rounded-xl border border-white/70 bg-white/55 px-3 py-2 text-slate-400 backdrop-blur-xl transition-all duration-200 hover:bg-white" style={{ fontSize: 11, width: 200 }}>
              <Search size={12} strokeWidth={1.5} />
              <span className="flex-1 text-left" style={{ fontSize: 11 }}>Cerca o vai a…</span>
              <span className="flex items-center gap-0.5 rounded-md border border-slate-200 px-1.5 py-0.5 font-bold text-slate-400" style={{ fontSize: 9.5 }}>
                <Command size={9} strokeWidth={2} />K
              </span>
            </button>
            <button onClick={openNewDeal} className="flex items-center gap-1.5 rounded-xl border border-indigo-200/70 bg-indigo-50/60 px-3 py-2 font-bold text-indigo-600 backdrop-blur-xl transition-all duration-200 hover:bg-indigo-100/70" style={{ fontSize: 11 }}>
              <Plus size={12} strokeWidth={2} />
              Nuova Pratica
            </button>
            <input ref={importRef} type="file" accept=".xlsx,.xls" className="hidden" onChange={handleImportExcel} />
            <button onClick={() => importRef.current?.click()} disabled={importLoading} className="flex items-center gap-1.5 rounded-xl border border-white/70 bg-white/55 px-3 py-2 font-semibold text-slate-600 backdrop-blur-xl transition-all duration-200 hover:bg-white" style={{ fontSize: 11, opacity: importLoading ? 0.6 : 1 }}>
              {importLoading ? <span className="h-3 w-3 animate-spin rounded-full border-2 border-slate-300 border-t-slate-600" /> : <FileUp size={12} strokeWidth={1.5} />}
              {importLoading ? "Caricamento…" : "Importa Excel"}
            </button>
            <button onClick={() => printDeals([...allDeals].sort((a, b) => b.r - a.r).slice(0, 10))} className="flex items-center gap-1.5 rounded-xl px-3.5 py-2 font-bold text-white transition-transform duration-200 hover:-translate-y-px active:translate-y-0" style={{ fontSize: 11, background: "linear-gradient(140deg,#6366f1,#7c3aed)", boxShadow: "0 8px 22px -8px rgba(99,102,241,.75), inset 0 1px 0 rgba(255,255,255,.22)" }}>
              <Download size={12} strokeWidth={1.5} />
              Esporta PDF
            </button>
          </div>
        </header>
        <main className="scrollzone flex-1 overflow-y-auto">
          {loading ? <SkeletonScreen /> : <ViewTransition viewKey={nav}>{renderView()}</ViewTransition>}
        </main>
      </div>

      {activeDeal && <DealDrawer deal={activeDeal} isClosing={drawerClosing} onRequestClose={requestClose} onExited={finishClose} onEdit={handleEditDeal} onApprove={handleApproveDeal} />}
      {compareOpen && <CompareDrawer deals={compareDeals} isClosing={compareClosing} onRequestClose={requestCloseCompare} onExited={finishCloseCompare} onRemove={toggleCompare} />}
      <NewDealDrawer isOpen={newDealOpen} isClosing={newDealClosing} onRequestClose={requestCloseNewDeal} onExited={finishCloseNewDeal} onSubmit={handleSubmitDeal} initialValues={editDeal} />
      <CommandPalette isOpen={paletteOpen} onClose={() => setPaletteOpen(false)} setNav={setNav} openDeal={openDeal} applyQuickFilter={applyQuickFilter} allDeals={allDeals} openNewDeal={openNewDeal} />
      {toastMsg && <Toast message={toastMsg} onDismiss={() => setToastMsg(null)} />}
    </div>
  );
}

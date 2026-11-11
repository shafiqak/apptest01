// ---- Learn Salah (phase 2). ALL CONTENT IS A DRAFT, pending review by a scholar/imam. ----
// Text can be a plain string or {hanafi:..., shafii:...}. Recitations list alternatives from other sources.
let SM=(CFG.madhhab==='shafii')?'shafii':'hanafi';
const pick=x=>x&&typeof x==='object'&&!Array.isArray(x)?x[SM]:x;
const ST=`Draft, not yet reviewed. Page and hadith numbers are to be added at review.`;

const REC=[
 {id:'takbir',t:'Takbir (opening)',ar:`ٱللَّٰهُ أَكْبَرُ`,tr:`Allahu akbar`,en:`Allah is the Greatest.`,src:`Bukhari, Muslim`},
 {id:'thana',t:'Opening supplication',ar:`سُبْحَانَكَ ٱللَّٰهُمَّ وَبِحَمْدِكَ، وَتَبَارَكَ ٱسْمُكَ، وَتَعَالَىٰ جَدُّكَ، وَلَا إِلَٰهَ غَيْرُكَ`,
  tr:`Subhanaka Allahumma wa bihamdika, wa tabarakasmuka, wa ta’ala jadduka, wa la ilaha ghayruk`,
  en:`Glory and praise be to You, O Allah. Blessed is Your name, exalted is Your majesty, and there is no god but You.`,
  src:`Abu Dawud, Tirmidhi, Ibn Majah. Usually taught in the Hanafi school.`,
  alts:[
   {l:`Wajjahtu (usually taught in the Shafi’i school)`,ar:`وَجَّهْتُ وَجْهِيَ لِلَّذِي فَطَرَ ٱلسَّمَاوَاتِ وَٱلْأَرْضَ حَنِيفًا وَمَا أَنَا مِنَ ٱلْمُشْرِكِينَ، إِنَّ صَلَاتِي وَنُسُكِي وَمَحْيَايَ وَمَمَاتِي لِلَّهِ رَبِّ ٱلْعَالَمِينَ، لَا شَرِيكَ لَهُ، وَبِذَٰلِكَ أُمِرْتُ وَأَنَا مِنَ ٱلْمُسْلِمِينَ`,
    tr:`Wajjahtu wajhiya lilladhi fataras-samawati wal-arda hanifan wa ma ana minal-mushrikin. Inna salati wa nusuki wa mahyaya wa mamati lillahi rabbil-’alamin. La sharika lahu wa bidhalika umirtu wa ana minal-muslimin`,
    en:`I have turned my face to the One who created the heavens and the earth, inclining to the truth, and I am not of the polytheists. My prayer, my sacrifice, my life and my death are for Allah, Lord of the worlds. He has no partner. This I was commanded, and I am among the Muslims.`,
    src:`Muslim, Abu Dawud. Wording varies between narrations (for example “wa ana awwalul-muslimin”); reviewer to confirm.`},
   {l:`Allahumma ba’id (permitted in all schools)`,ar:`ٱللَّٰهُمَّ بَاعِدْ بَيْنِي وَبَيْنَ خَطَايَايَ كَمَا بَاعَدْتَ بَيْنَ ٱلْمَشْرِقِ وَٱلْمَغْرِبِ، ٱللَّٰهُمَّ نَقِّنِي مِنَ ٱلْخَطَايَا كَمَا يُنَقَّى ٱلثَّوْبُ ٱلْأَبْيَضُ مِنَ ٱلدَّنَسِ، ٱللَّٰهُمَّ ٱغْسِلْنِي مِنْ خَطَايَايَ بِٱلْمَاءِ وَٱلثَّلْجِ وَٱلْبَرَدِ`,
    tr:`Allahumma ba’id bayni wa bayna khatayaya kama ba’adta baynal-mashriqi wal-maghrib. Allahumma naqqini minal-khataya kama yunaqqath-thawbul-abyadu minad-danas. Allahummaghsilni min khatayaya bil-ma’i wath-thalji wal-barad`,
    en:`O Allah, put distance between me and my sins as You put distance between the east and the west. O Allah, cleanse me of sins as a white garment is cleansed of dirt. O Allah, wash my sins away with water, snow and hail.`,src:`Bukhari, Muslim`}]},
 {id:'taawwudh',t:'Seeking refuge (Ta’awwudh)',ar:`أَعُوذُ بِٱللَّٰهِ مِنَ ٱلشَّيْطَانِ ٱلرَّجِيمِ`,tr:`A’udhu billahi minash-shaytanir-rajim`,en:`I seek refuge in Allah from Satan, the accursed.`,src:`Quran 16:98`},
 {id:'bismillah',t:'Bismillah',ar:`بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ`,tr:`Bismillahir-Rahmanir-Rahim`,en:`In the name of Allah, the Most Gracious, the Most Merciful.`,src:`Quran`},
 {id:'fatiha',q:'1:1-7',t:'Surah Al-Fatiha',ar:`بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ. ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَٰلَمِينَ. ٱلرَّحْمَٰنِ ٱلرَّحِيمِ. مَٰلِكِ يَوْمِ ٱلدِّينِ. إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ. ٱهْدِنَا ٱلصِّرَٰطَ ٱلْمُسْتَقِيمَ. صِرَٰطَ ٱلَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ ٱلْمَغْضُوبِ عَلَيْهِمْ وَلَا ٱلضَّآلِّينَ`,
  tr:`Bismillahir-Rahmanir-Rahim. Alhamdu lillahi rabbil-’alamin. Ar-Rahmanir-Rahim. Maliki yawmid-din. Iyyaka na’budu wa iyyaka nasta’in. Ihdinas-siratal-mustaqim. Siratal-ladhina an’amta ’alayhim, ghayril-maghdubi ’alayhim wa lad-dallin. (Then say: Amin)`,
  en:`In the name of Allah, the Most Gracious, the Most Merciful. All praise is for Allah, Lord of the worlds. The Most Gracious, the Most Merciful. Master of the Day of Judgment. You alone we worship and You alone we ask for help. Guide us to the straight path, the path of those You have blessed, not of those who earned Your anger, nor of those who went astray.`,
  src:`Quran 1. Say Amin after it. Text: Noble Qur’an Encyclopedia; transliteration and translation (Saheeh International): Tanzil.`},
 {id:'ikhlas',q:'112:1-4',t:'Surah Al-Ikhlas (example short surah)',ar:`قُلْ هُوَ ٱللَّهُ أَحَدٌ. ٱللَّهُ ٱلصَّمَدُ. لَمْ يَلِدْ وَلَمْ يُولَدْ. وَلَمْ يَكُن لَّهُۥ كُفُوًا أَحَدٌۢ`,
  tr:`Qul huwa Allahu ahad. Allahus-samad. Lam yalid wa lam yulad. Wa lam yakun lahu kufuwan ahad`,
  en:`Say: He is Allah, the One. Allah, the Self-Sufficient. He neither begets nor is born, and there is none comparable to Him.`,src:`Quran 112. Text: Noble Qur’an Encyclopedia; transliteration and translation (Saheeh International): Tanzil. More surahs are in the Quran reader.`},
 {id:'ruku',t:'In ruku (bowing)',ar:`سُبْحَانَ رَبِّيَ ٱلْعَظِيمِ`,tr:`Subhana rabbiyal-’azim (three times)`,en:`Glory be to my Lord, the Magnificent.`,src:`Abu Dawud, Tirmidhi, Ibn Majah`,
  alts:[{l:`Subbuhun Quddus`,ar:`سُبُّوحٌ قُدُّوسٌ رَبُّ ٱلْمَلَائِكَةِ وَٱلرُّوحِ`,tr:`Subbuhun quddusun rabbul-mala’ikati war-ruh`,en:`Most Glorious, Most Holy, Lord of the angels and the Spirit.`,src:`Muslim`},
        {l:`Subhanaka Allahumma rabbana`,ar:`سُبْحَانَكَ ٱللَّٰهُمَّ رَبَّنَا وَبِحَمْدِكَ، ٱللَّٰهُمَّ ٱغْفِرْ لِي`,tr:`Subhanaka Allahumma rabbana wa bihamdika, Allahummaghfir li`,en:`Glory and praise to You, our Lord. O Allah, forgive me.`,src:`Bukhari, Muslim`}]},
 {id:'qawma',t:'Rising from ruku',ar:`سَمِعَ ٱللَّٰهُ لِمَنْ حَمِدَهُ، رَبَّنَا وَلَكَ ٱلْحَمْدُ`,tr:`Sami’allahu liman hamidah. Rabbana wa lakal-hamd`,en:`Allah hears the one who praises Him. Our Lord, to You is all praise.`,src:`Bukhari, Muslim. Who says which part differs by school (see How to pray).`,
  alts:[{l:`Without “wa”`,ar:`رَبَّنَا لَكَ ٱلْحَمْدُ`,tr:`Rabbana lakal-hamd`,en:`Our Lord, to You is all praise.`,src:`Bukhari, Muslim`},
        {l:`Longer form`,ar:`رَبَّنَا وَلَكَ ٱلْحَمْدُ حَمْدًا كَثِيرًا طَيِّبًا مُبَارَكًا فِيهِ`,tr:`Rabbana wa lakal-hamdu hamdan kathiran tayyiban mubarakan fih`,en:`Our Lord, to You is much good and blessed praise.`,src:`Bukhari`}]},
 {id:'sujood',t:'In sujood (prostration)',ar:`سُبْحَانَ رَبِّيَ ٱلْأَعْلَىٰ`,tr:`Subhana rabbiyal-a’la (three times)`,en:`Glory be to my Lord, the Most High.`,src:`Abu Dawud, Tirmidhi, Ibn Majah`,
  alts:[{l:`Same alternatives as in ruku`,ar:`سُبُّوحٌ قُدُّوسٌ رَبُّ ٱلْمَلَائِكَةِ وَٱلرُّوحِ`,tr:`Subbuhun quddusun rabbul-mala’ikati war-ruh`,en:`Most Glorious, Most Holy, Lord of the angels and the Spirit.`,src:`Muslim`}]},
 {id:'jalsa',t:'Sitting between the two sujoods',ar:`رَبِّ ٱغْفِرْ لِي، رَبِّ ٱغْفِرْ لِي`,tr:`Rabbighfir li, rabbighfir li`,en:`My Lord, forgive me. My Lord, forgive me.`,src:`Abu Dawud, Nasa’i, Ibn Majah`,
  alts:[{l:`Longer supplication`,ar:`ٱللَّٰهُمَّ ٱغْفِرْ لِي وَٱرْحَمْنِي وَٱجْبُرْنِي وَٱرْفَعْنِي وَٱهْدِنِي وَعَافِنِي وَٱرْزُقْنِي`,tr:`Allahummaghfir li warhamni wajburni warfa’ni wahdini wa ’afini warzuqni`,en:`O Allah, forgive me, have mercy on me, mend me, raise me, guide me, give me well-being and provide for me.`,src:`Abu Dawud, Tirmidhi, Ibn Majah. Wording differs slightly between narrations.`}]},
 {id:'tashahhud',t:'Tashahhud (At-Tahiyyat)',ar:`ٱلتَّحِيَّاتُ لِلَّٰهِ وَٱلصَّلَوَاتُ وَٱلطَّيِّبَاتُ، ٱلسَّلَامُ عَلَيْكَ أَيُّهَا ٱلنَّبِيُّ وَرَحْمَةُ ٱللَّٰهِ وَبَرَكَاتُهُ، ٱلسَّلَامُ عَلَيْنَا وَعَلَىٰ عِبَادِ ٱللَّٰهِ ٱلصَّالِحِينَ، أَشْهَدُ أَنْ لَا إِلَٰهَ إِلَّا ٱللَّٰهُ، وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ`,
  tr:`At-tahiyyatu lillahi was-salawatu wat-tayyibat. As-salamu ’alayka ayyuhan-nabiyyu wa rahmatullahi wa barakatuh. As-salamu ’alayna wa ’ala ’ibadillahis-salihin. Ash-hadu an la ilaha illallah, wa ash-hadu anna Muhammadan ’abduhu wa rasuluh`,
  en:`All greetings, prayers and good things are for Allah. Peace be upon you, O Prophet, and Allah’s mercy and blessings. Peace be upon us and upon Allah’s righteous servants. I bear witness that there is no god but Allah, and I bear witness that Muhammad is His servant and messenger.`,
  src:`Ibn Mas’ud’s wording: Bukhari, Muslim. Usually taught in the Hanafi school.`,
  alts:[{l:`Ibn ’Abbas’s wording (usually taught in the Shafi’i school)`,ar:`ٱلتَّحِيَّاتُ ٱلْمُبَارَكَاتُ ٱلصَّلَوَاتُ ٱلطَّيِّبَاتُ لِلَّٰهِ، ٱلسَّلَامُ عَلَيْكَ أَيُّهَا ٱلنَّبِيُّ وَرَحْمَةُ ٱللَّٰهِ وَبَرَكَاتُهُ، ٱلسَّلَامُ عَلَيْنَا وَعَلَىٰ عِبَادِ ٱللَّٰهِ ٱلصَّالِحِينَ، أَشْهَدُ أَنْ لَا إِلَٰهَ إِلَّا ٱللَّٰهُ، وَأَشْهَدُ أَنَّ مُحَمَّدًا رَسُولُ ٱللَّٰهِ`,
    tr:`At-tahiyyatul-mubarakatus-salawatut-tayyibatu lillah. As-salamu ’alayka ayyuhan-nabiyyu wa rahmatullahi wa barakatuh. As-salamu ’alayna wa ’ala ’ibadillahis-salihin. Ash-hadu an la ilaha illallah, wa ash-hadu anna Muhammadan rasulullah`,
    en:`The blessed greetings, the prayers and the good things are for Allah. Peace be upon you, O Prophet, and Allah’s mercy and blessings. Peace be upon us and upon Allah’s righteous servants. I bear witness that there is no god but Allah, and I bear witness that Muhammad is the messenger of Allah.`,src:`Muslim`}]},
 {id:'durood',t:'Durood Ibrahim (final sitting)',ar:`ٱللَّٰهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ وَعَلَىٰ آلِ مُحَمَّدٍ، كَمَا صَلَّيْتَ عَلَىٰ إِبْرَاهِيمَ وَعَلَىٰ آلِ إِبْرَاهِيمَ، إِنَّكَ حَمِيدٌ مَجِيدٌ، ٱللَّٰهُمَّ بَارِكْ عَلَىٰ مُحَمَّدٍ وَعَلَىٰ آلِ مُحَمَّدٍ، كَمَا بَارَكْتَ عَلَىٰ إِبْرَاهِيمَ وَعَلَىٰ آلِ إِبْرَاهِيمَ، إِنَّكَ حَمِيدٌ مَجِيدٌ`,
  tr:`Allahumma salli ’ala Muhammadin wa ’ala ali Muhammad, kama sallayta ’ala Ibrahima wa ’ala ali Ibrahim, innaka Hamidun Majid. Allahumma barik ’ala Muhammadin wa ’ala ali Muhammad, kama barakta ’ala Ibrahima wa ’ala ali Ibrahim, innaka Hamidun Majid`,
  en:`O Allah, send prayers upon Muhammad and the family of Muhammad as You sent prayers upon Ibrahim and the family of Ibrahim; You are Praiseworthy, Glorious. O Allah, bless Muhammad and the family of Muhammad as You blessed Ibrahim and the family of Ibrahim; You are Praiseworthy, Glorious.`,src:`Bukhari, Muslim`},
 {id:'duabefore',q:'2:201',t:'Dua before the salaam',ar:`رَبَّنَا آتِنَا فِي ٱلدُّنْيَا حَسَنَةً وَفِي ٱلْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ ٱلنَّارِ`,tr:`Rabbana atina fid-dunya hasanatan wa fil-akhirati hasanatan wa qina ’adhaban-nar`,en:`Our Lord, give us good in this world and good in the next, and protect us from the punishment of the Fire.`,src:`Quran 2:201`,
  alts:[{l:`Dua of Abu Bakr`,ar:`ٱللَّٰهُمَّ إِنِّي ظَلَمْتُ نَفْسِي ظُلْمًا كَثِيرًا، وَلَا يَغْفِرُ ٱلذُّنُوبَ إِلَّا أَنْتَ، فَٱغْفِرْ لِي مَغْفِرَةً مِنْ عِنْدِكَ وَٱرْحَمْنِي، إِنَّكَ أَنْتَ ٱلْغَفُورُ ٱلرَّحِيمُ`,tr:`Allahumma inni zalamtu nafsi zulman kathira, wa la yaghfirudh-dhunuba illa anta, faghfir li maghfiratan min ’indika warhamni, innaka antal-Ghafurur-Rahim`,en:`O Allah, I have wronged myself greatly and none forgives sins but You. Forgive me with forgiveness from You and have mercy on me; You are the Forgiving, the Merciful.`,src:`Bukhari, Muslim`},
        {q:'14:40',l:`Rabbij’alni (often taught in the Hanafi school)`,ar:`رَبِّ ٱجْعَلْنِي مُقِيمَ ٱلصَّلَاةِ وَمِنْ ذُرِّيَّتِي، رَبَّنَا وَتَقَبَّلْ دُعَاءِ`,tr:`Rabbij’alni muqimas-salati wa min dhurriyyati, rabbana wa taqabbal du’a`,en:`My Lord, make me one who establishes prayer, and my offspring too. Our Lord, accept my prayer.`,src:`Quran 14:40`},
        {l:`Seeking refuge (four things)`,ar:`ٱللَّٰهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ عَذَابِ جَهَنَّمَ، وَمِنْ عَذَابِ ٱلْقَبْرِ، وَمِنْ فِتْنَةِ ٱلْمَحْيَا وَٱلْمَمَاتِ، وَمِنْ شَرِّ فِتْنَةِ ٱلْمَسِيحِ ٱلدَّجَّالِ`,tr:`Allahumma inni a’udhu bika min ’adhabi jahannam, wa min ’adhabil-qabr, wa min fitnatil-mahya wal-mamat, wa min sharri fitnatil-masihid-dajjal`,en:`O Allah, I seek refuge in You from the punishment of Hell, the punishment of the grave, the trials of life and death, and the evil of the trial of the False Messiah.`,src:`Bukhari, Muslim`}]},
 {id:'salaam',t:'Salaam (ending the prayer)',ar:`ٱلسَّلَامُ عَلَيْكُمْ وَرَحْمَةُ ٱللَّٰهِ`,tr:`As-salamu ’alaykum wa rahmatullah (right, then left)`,en:`Peace and Allah’s mercy be upon you.`,src:`Abu Dawud, Tirmidhi`,
  alts:[{l:`With “wa barakatuh”`,ar:`ٱلسَّلَامُ عَلَيْكُمْ وَرَحْمَةُ ٱللَّٰهِ وَبَرَكَاتُهُ`,tr:`As-salamu ’alaykum wa rahmatullahi wa barakatuh`,en:`Peace, Allah’s mercy and blessings be upon you.`,src:`Abu Dawud (narration differs; reviewer to confirm)`}]},
 {id:'wudu1',t:'Before wudu',ar:`بِسْمِ ٱللَّٰهِ`,tr:`Bismillah`,en:`In the name of Allah.`,src:`Abu Dawud, Ibn Majah`},
 {id:'wudu2',t:'After wudu',ar:`أَشْهَدُ أَنْ لَا إِلَٰهَ إِلَّا ٱللَّٰهُ وَحْدَهُ لَا شَرِيكَ لَهُ، وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ`,tr:`Ash-hadu an la ilaha illallahu wahdahu la sharika lah, wa ash-hadu anna Muhammadan ’abduhu wa rasuluh`,en:`I bear witness that there is no god but Allah alone, with no partner, and that Muhammad is His servant and messenger.`,src:`Muslim`,
  alts:[{l:`Added supplication`,ar:`ٱللَّٰهُمَّ ٱجْعَلْنِي مِنَ ٱلتَّوَّابِينَ وَٱجْعَلْنِي مِنَ ٱلْمُتَطَهِّرِينَ`,tr:`Allahummaj’alni minat-tawwabina waj’alni minal-mutatahhirin`,en:`O Allah, make me among those who repent and among those who purify themselves.`,src:`Tirmidhi`}]}
];

const PAGES={
 conditions:{t:`Before you pray`,m:1,b:[
  {h:`Conditions of a valid prayer`,l:[`Being Muslim, of sound mind and past puberty (children are encouraged to start at about seven).`,`The time of the prayer has begun (see Home for today’s times).`,`Purity: wudu, or ghusl when required.`,`A clean body, clothes and place of prayer.`,
    `Covering the awrah. For a man: navel to knees. For a woman: the whole body except the face and hands.`,
    {hanafi:`For a woman, the feet are not part of the awrah in prayer.`,shafii:`For a woman, the feet are part of the awrah in prayer.`},
    `Facing the Qibla (use the Qibla compass in More). If unsure, make your best effort.`,`Intention (niyyah) in the heart.`]},
  {h:`Before you start`,l:[`Check that the time has entered and silence your phone.`,`Make wudu and put on clean clothes.`,`Use a clean mat or place, facing the Qibla.`]}],
  refs:`Hanafi: Mukhtasar al-Quduri, Nur al-Idah. Shafi’i: Safinat al-Naja, ’Umdat al-Salik. ${ST}`},
 wudu:{t:`Wudu (ablution)`,m:1,b:[
  {h:`Essential acts (fard)`,l:{hanafi:[`Washing the face`,`Washing both arms including the elbows`,`Wiping one quarter of the head`,`Washing both feet including the ankles`],
    shafii:[`Intention (at the moment of washing the face)`,`Washing the face`,`Washing both arms including the elbows`,`Wiping some part of the head`,`Washing both feet including the ankles`,`Doing these in order`]}},
  {h:`Steps`,n:[`Make the intention in your heart.`,`Say Bismillah.`,`Wash both hands up to the wrists, three times.`,`Rinse the mouth three times.`,`Sniff water into the nose and blow it out, three times.`,`Wash the face three times, from the hairline to the chin and ear to ear.`,`Wash the right arm up to and including the elbow, three times, then the left.`,
    {hanafi:`Wipe the head once with wet hands, then wipe the ears.`,shafii:`Wipe the head with wet hands (the whole head is recommended), then wipe the ears.`},`Wash the right foot up to and including the ankle, three times, then the left. Run the fingers between the toes.`,`Say the supplication after wudu (see Recitations).`]},
  {h:`What breaks wudu`,l:{hanafi:[`Anything that comes out of the front or back passage.`,`Flowing blood or pus that leaves its place.`,`Vomiting a mouthful.`,`Deep sleep lying down or leaning, fainting or loss of mind.`,`Laughing out loud during a prayer that has ruku and sujood.`],
    shafii:[`Anything that comes out of the front or back passage.`,`Sleep, unless sitting firmly on the ground.`,`Fainting or loss of mind.`,`Touching the private parts with the palm of the hand.`,`Skin-to-skin contact between a man and a woman who may marry each other, without a barrier.`]}}],
  refs:`Hanafi: Mukhtasar al-Quduri, Nur al-Idah. Shafi’i: Safinat al-Naja. Wiping over socks and other cases will be added later. ${ST}`},
 ghusl:{t:`Ghusl (full bath)`,m:1,b:[
  {h:`When it is required`,l:[`After sexual intercourse or the emission of semen.`,`At the end of menstruation.`,`At the end of postnatal bleeding.`,`(Details for women will be in a separate guide, with scholarly review.)`]},
  {h:`Essential acts (fard)`,l:{hanafi:[`Rinsing the mouth`,`Rinsing the nose`,`Washing the whole body so water reaches every part`],shafii:[`Intention`,`Washing the whole body, including hair and skin`]}},
  {h:`Steps`,n:[`Make the intention in your heart and say Bismillah.`,`Wash both hands, then the private parts and any impurity on the body.`,`Make wudu.`,`Pour water over the head three times, wetting the roots of the hair.`,`Pour water over the right shoulder, then the left.`,`Wash the whole body, including the navel, armpits and between the toes.`]}],
  refs:`Hanafi: Mukhtasar al-Quduri. Shafi’i: Safinat al-Naja. ${ST}`},
 tayammum:{t:`Tayammum (dry ablution)`,m:1,b:[
  {h:`When it is allowed`,l:[`You cannot find water after looking for it.`,`You cannot use water because of illness or harm.`]},
  {h:`What to use`,p:{hanafi:`Clean earth-type surfaces such as dust, sand, clay or stone.`,shafii:`Clean dust.`}},
  {h:`Steps`,n:[`Make the intention for tayammum and say Bismillah.`,`Strike both palms lightly on the clean surface, then wipe the face.`,`Strike again, then wipe both arms up to the elbows (right, then left).`,`It ends when you find water, or when something breaks wudu.`]},
  {h:`Note`,p:`Other schools differ in details (for example one strike and wiping to the wrists). These will be covered with their madhhabs.`}],
  refs:`Hanafi: Mukhtasar al-Quduri. Shafi’i: Safinat al-Naja. ${ST}`},
 types:{t:`Fard, Sunnah, Wajib, Nafl`,m:1,b:[
  {h:`Fard`,p:`Obligatory. Leaving it without an excuse is a sin, and the prayer is not valid if its essential acts are missed.`},
  {h:`Wajib`,p:{hanafi:`Obligatory, but established by evidence that is not definitive, for example Witr, the Eid prayers, and reciting Al-Fatiha with another surah. Forgetting one by mistake needs a sajdah of forgetfulness (sajdah sahw).`,shafii:`The Shafi’i school does not have a separate category: what is wajib is the same as fard.`}},
  {h:`Sunnah mu’akkadah`,p:`A strongly emphasised practice that the Prophet ﷺ kept regularly. It earns great reward.`},
  {h:`Sunnah ghayr mu’akkadah`,p:`A practice done sometimes. It earns reward, with no blame for leaving it.`},
  {h:`Nafl`,p:`Optional extra prayer, for extra reward.`}],
  refs:`Hanafi: Radd al-Muhtar, Nur al-Idah. Shafi’i: ’Umdat al-Salik. ${ST}`},
 steps:{t:`How to pray`,m:1,note:`Shown for a two-rakat prayer. For three- and four-rakat prayers, see the notes at the end.`,st:[
  {t:`Stand and make the intention`,d:`Face the Qibla and make the intention in your heart for the prayer you are about to pray.`},
  {t:`Takbir (Allahu akbar)`,d:{hanafi:`Raise the hands so the thumbs touch the earlobes, palms toward the Qibla, and say Allahu akbar.`,shafii:`Raise the hands to the shoulders, palms toward the Qibla, and say Allahu akbar.`}},
  {t:`Place the hands`,d:{hanafi:`Right hand over the left, below the navel.`,shafii:`Right hand over the left, above the navel, under the chest.`}},
  {t:`Opening supplication`,d:{hanafi:`Recite Subhanaka Allahumma. Alternatives are in Recitations.`,shafii:`Recite Wajjahtu. Alternatives are in Recitations.`}},
  {t:`Seek refuge, then Bismillah`,d:{hanafi:`Say the Ta’awwudh and Bismillah quietly.`,shafii:`Say the Ta’awwudh. Bismillah is part of Al-Fatiha and is said aloud in the loud prayers.`}},
  {t:`Al-Fatiha, then Amin`,d:{hanafi:`Recite Al-Fatiha and say Amin quietly.`,shafii:`Recite Al-Fatiha. Say Amin aloud in the loud prayers.`}},
  {t:`Another surah`,d:{hanafi:`Recite a surah (or at least three short verses) in the first two rakats of a fard prayer. This is wajib.`,shafii:`Recite a surah after Al-Fatiha in the first two rakats. This is sunnah.`}},
  {t:`Ruku (bowing)`,d:{hanafi:`Say Allahu akbar and bow, hands on the knees, back level. Say Subhana rabbiyal-’azim three times.`,shafii:`Raise the hands to the shoulders, say Allahu akbar and bow, hands on the knees, back level. Say Subhana rabbiyal-’azim three times.`}},
  {t:`Rise from ruku`,d:{hanafi:`The imam says Sami’allahu liman hamidah; the followers say Rabbana wa lakal-hamd; someone praying alone says both.`,shafii:`Raise the hands, and everyone says Sami’allahu liman hamidah, then Rabbana wa lakal-hamd.`}},
  {t:`Sujood (prostration)`,d:`Say Allahu akbar and go down on the knees, hands, then forehead and nose, toes pointing to the Qibla. Say Subhana rabbiyal-a’la three times.`},
  {t:`Sit, then the second sujood`,d:`Say Allahu akbar and sit upright on the left foot with the right foot upright. Say Rabbighfir li. Then say Allahu akbar and make the second sujood.`},
  {t:`Stand for the second rakat`,d:`Say Allahu akbar and stand. Repeat the same, without the opening supplication.`},
  {t:`Sit for the Tashahhud`,d:`After the second sujood of the last rakat, sit and recite the Tashahhud, then the Durood Ibrahim, then a supplication (see Recitations).`},
  {t:`Salaam`,d:`Turn the head to the right and say As-salamu ’alaykum wa rahmatullah, then to the left and say it again.`},
  {t:`Three- and four-rakat prayers`,d:{hanafi:`After the second rakat, sit for the Tashahhud only, then stand. In the remaining rakats of a fard prayer, recite Al-Fatiha only. Durood and the final supplications come in the last sitting.`,shafii:`After the second rakat, sit for the first Tashahhud, then stand. In the remaining rakats, recite Al-Fatiha. In the final sitting, sit with the left hip on the ground (tawarruk) and recite the Tashahhud, Durood and a supplication.`}}],
  refs:`Hanafi: Mukhtasar al-Quduri, Nur al-Idah. Shafi’i: ’Umdat al-Salik, Safinat al-Naja. Hadith of the man who prayed badly: Bukhari, Muslim. ${ST}`},
 mistakes:{t:`Common mistakes`,b:[{l:[
  `Rushing without pausing in ruku, sujood, standing after ruku and sitting between sujoods. The Prophet ﷺ told a man who prayed hastily to pray again (Bukhari, Muslim).`,
  `Reciting Al-Fatiha too fast or with wrong letters. Learn it with a teacher.`,
  `Missing parts in wudu, such as the heels, elbows, or between the fingers and toes.`,
  `Praying before the time begins. Check the times.`,
  `Clothes slipping or being see-through, so the awrah is uncovered in ruku or sujood.`,
  `Looking around, looking up, playing with clothes or the phone, or moving a lot.`,
  `Going ahead of the imam in ruku, sujood or the salaam.`,
  `Leaving the phone on. Silence it.`]}],refs:ST},
};
const MENU=[['conditions','Before you pray','Conditions of a valid prayer'],['wudu','Wudu','Ablution, step by step'],['ghusl','Ghusl','The full bath'],['tayammum','Tayammum','When water is not available'],['steps','How to pray','Step by step'],['rakats','Rakats','Fard, sunnah and witr for each prayer'],['types','Fard, Sunnah, Wajib, Nafl','What the terms mean'],['recitations','Recitations','Arabic, transliteration, translation and alternatives'],['quran','Quran','Read the Quran: Arabic, transliteration, translation'],['mistakes','Common mistakes','']];

// rakat tables: [type, count, label]; types f fard, w wajib, sm sunnah mu'akkadah, sg sunnah ghayr mu'akkadah, n nafl
const RK={
 hanafi:{fajr:[['sm',2,`Sunnah mu’akkadah`],['f',2,`Fard`]],
  dhuhr:[['sm',4,`Sunnah mu’akkadah`],['f',4,`Fard`],['sm',2,`Sunnah mu’akkadah`],['n',2,`Nafl`]],
  asr:[['sg',4,`Sunnah ghayr mu’akkadah`],['f',4,`Fard`]],
  maghrib:[['f',3,`Fard`],['sm',2,`Sunnah mu’akkadah`],['n',2,`Nafl`]],
  isha:[['sg',4,`Sunnah ghayr mu’akkadah`],['f',4,`Fard`],['sm',2,`Sunnah mu’akkadah`],['n',2,`Nafl`],['w',3,`Witr (wajib)`],['n',2,`Nafl`]]},
 shafii:{fajr:[['sm',2,`Sunnah mu’akkadah`],['f',2,`Fard`]],
  dhuhr:[['sm',2,`Sunnah mu’akkadah`],['sg',2,`Sunnah ghayr mu’akkadah (additional)`],['f',4,`Fard`],['sm',2,`Sunnah mu’akkadah`],['sg',2,`Sunnah ghayr mu’akkadah (additional)`]],
  asr:[['sg',4,`Sunnah ghayr mu’akkadah (at least 2)`],['f',4,`Fard`]],
  maghrib:[['sg',2,`Sunnah ghayr mu’akkadah`],['f',3,`Fard`],['sm',2,`Sunnah mu’akkadah`]],
  isha:[['sg',2,`Sunnah ghayr mu’akkadah`],['f',4,`Fard`],['sm',2,`Sunnah mu’akkadah`],['sm',3,`Witr (sunnah mu’akkadah, 1 to 11; 3 is common)`]]}};
const RKNOTE={hanafi:{isha:`Witr is wajib: three rakats with one sitting, reciting Dua Qunoot in the third rakat before ruku. Dua Qunoot is in Duas and Surahs (coming).`,dhuhr:`The four sunnah before Dhuhr are mu’akkadah.`},
 shafii:{fajr:`Dua Qunoot is recited in the second rakat after rising from ruku. It will be in Duas and Surahs (coming).`,isha:`Witr can be prayed as 2 + 1 rakats. Some prefer it after the night prayer (tahajjud).`}};
let RKP='fajr';

const hdr=t=>`<a class="back" href="#salah"><svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg>Salah</a><h1>${t}</h1>`;
const banner=()=>`<div class="sbanner">Draft: not yet reviewed by a scholar. Please confirm with your imam.</div>`;
const mchips=()=>`<div class="chips">`+['hanafi','shafii'].map(m=>`<button class="chip${SM===m?' on':''}" data-sm="${m}">${MADHHAB[m]}</button>`).join('')+`</div>`+((CFG.madhhab==='maliki'||CFG.madhhab==='hanbali')?`<p>Guides for the ${MADHHAB[CFG.madhhab]} school are coming. For now, choose one of these.</p>`:'');
const rec=r=>{if(r.q&&QD.ar&&QD.en&&QD.tr)r={...r,ar:qtext('ar',r.q),tr:qtext('tr',r.q),en:qtext('en',r.q)};return recHtml(r)};
const recHtml=r=>`<div class="rc"><div class="arb" lang="ar" dir="rtl">${r.ar}</div><div class="tr">${esc(r.tr)}</div><div class="en">${esc(r.en)}</div><div class="src">${esc(r.src)}</div></div>`;
function body(b){
  return b.map(x=>{let s='';if(x.h)s+=`<h2>${x.h}</h2>`;const p=pick(x.p);if(p)s+=`<p>${p}</p>`;
    for(const k of ['l','n']){let a=pick(x[k]);if(a){a=a.map(pick).filter(Boolean);s+=`<${k==='l'?'ul':'ol'}>`+a.map(i=>`<li>${i}</li>`).join('')+`</${k==='l'?'ul':'ol'}>`}}return s}).join('');
}
function renderSalah(sub,sub2,sub3){
  const el=$('#sbody');
  if(sub==='quran'){renderQuran(sub2,sub3);return}
  if(sub==='recitations'&&!(QD.ar&&QD.en&&QD.tr))Promise.all(['ar','en','tr'].map(qload)).then(()=>{if(location.hash.startsWith('#salah/recitations'))renderSalah('recitations')}).catch(()=>{});
  if(!sub){
    el.innerHTML=`<h1>Learn Salah</h1>${banner()}`+MENU.map(m=>`<a class="item" href="#salah/${m[0]}"><div>${m[1]}${m[2]?`<small>${m[2]}</small>`:''}</div><span class="c">›</span></a>`).join('');return}
  let h='';
  if(sub==='rakats'){
    const T=RK[SM],tot=T[RKP].reduce((a,r)=>a+r[1],0);
    h=hdr('Rakats')+banner()+mchips()+`<div class="chips">`+['fajr','dhuhr','asr','maghrib','isha'].map(p=>`<button class="chip${RKP===p?' on':''}" data-rp="${p}">${p[0].toUpperCase()+p.slice(1)}</button>`).join('')+`</div>`+
      T[RKP].map(r=>`<div class="rk ${r[0]}"><b>${r[1]}</b><span>${r[2]}</span></div>`).join('')+`<p>Total: ${tot} rakats including optional ones. Fard is the same in every school.</p>`+((RKNOTE[SM]||{})[RKP]?`<p>${RKNOTE[SM][RKP]}</p>`:'')+`<p class="src">Hanafi: Radd al-Muhtar, Nur al-Idah. Shafi’i: ’Umdat al-Salik, Minhaj al-Talibin. ${ST} Jumu’ah has its own guide (later).</p>`;
  }else if(sub==='recitations'){
    h=hdr('Recitations')+banner()+REC.map(r=>`<details class="rcd"><summary>${r.t}</summary>${rec(r)}${(r.alts||[]).map(a=>`<div class="alt">Alternative: ${esc(a.l)}</div>${rec(a)}`).join('')}</details>`).join('')+`<p class="src">Quranic items are read from the embedded Quran data. ${ST}</p>`;
  }else if(PAGES[sub]){
    const P=PAGES[sub];
    h=hdr(P.t)+banner()+(P.m?mchips():'')+(P.note?`<p>${P.note}</p>`:'')+
      (P.st?`<ol class="steps">`+P.st.map(s=>`<li><b>${s.t}</b><br>${pick(s.d)}</li>`).join('')+`</ol>`:body(P.b))+`<p class="src">${P.refs}</p>`;
  }else{renderSalah();return}
  el.innerHTML=h;
}
$('#sbody').addEventListener('click',e=>{
  const b=e.target.closest('button');if(!b)return;
  if(b.dataset.sm){SM=b.dataset.sm}else if(b.dataset.rp){RKP=b.dataset.rp}else return;
  renderSalah(location.hash.split('/')[1]);
});

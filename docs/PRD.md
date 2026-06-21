product Requirements Document (PRD): 
Jodia Bazar Aur Pakistani Wholesale 
Market Ke Liye Mukammal Offline-First 
ERP Nizam 
1. Project Ka Buniadi Khayal Aur Market Ka 
Pas-e-Manzar (Executive Summary & Market Context) 
Pakistani wholesale aur distribution market, khusoosan Jodia Bazar Karachi, Akbari Mandi 
Lahore, aur deegar bari mandiyon mein, karobar chalane ka tareeqa nihayat tezi aur riwayati 
tarz par mabni hai. Yahan rozana hazaron transactions hoti hain, aur karobar ka inhisaar 
kaghazi bahi-khaton, WhatsApp messages, aur sadiyon puranay "Munshi" nizam par hai. 
Maujooda market mein dastiyab software solutions ya toh bohot zyada pecheeda (complex) 
hain jo aam dukaandar ki samajh se bahir hain, ya phir un mein local market ki zarioriyat—jaise 
ke 'Bori' aur 'Peti' ka hisab, 'Palledari' aur 'Hamali' ke kharchay, aur pakkay udhaar khate—ko 
sahi tarah se shamil nahi kiya gaya hai. 
Jodia Bazar jaise ilaqon mein informal trading aur undocumented economy ka rujhan zyada hai. 
Yahan rates din mein kai baar tabdeel hote hain, aur baz oqaat traders ko strike ya market 
bandish jese masail ka samna karna parta hai, jis ki wajah se unka hisab kitab mazeed ulajh 
jata hai. Ek aam tajir ko ek aise nizam ki zaroorat hai jo unke tezi se badalte hue halaat ko 
samajh sakay. Yeh Product Requirements Document (PRD) ek exhaustive blueprint faraham 
karta hai ek aise B2B/B2C SaaS Multi-Tenant Desktop application ke liye, jo bilkul ground-reality 
par design kiya gaya hai. Is nizam mein local traders ki asani ke liye simple UX, bina internet ke 
mukammal offline functionality, aur accurate stock calculations ko bunyad banaya gaya hai. 
Is project ka vision ek aisi desktop application (Trader Desktop 2.0) tayar karna hai jo Electron 
framework ke zariye Windows par native application ke tor par chalay. Yeh bina internet ke local 
database (Realm) par kaam karegi, aur internet aane par automatically cloud (MongoDB Atlas) 
ke sath sync ho jayegi, jis se data loss ka khatra hamesha ke liye khatam ho jayega. 
2. Competitor Analysis Aur Maujooda Systems Ki 
Kamiyan (Gap Analysis) 
Market mein mojood mukhtalif local aur international platforms ka gehra tajziya kiya gaya hai 
taake un ki kamiyon ko samajh kar is PRD mein behtar hal pesh kiya ja sakay. Neeche di gayi 
table in companies ke strongest areas aur hamare local Jodia Bazar style trader ke hawale se 
unki kamiyon ko wazeh karti hai. 
Company Name 
Strongest Area 
Jodia Bazar / Local Market Ke 
Lihaz Se Kamiyan (Flaws / 
Gaps) 
Systems Ltd 
Tech Architecture, Multi-Tenant, Yeh system bohot high-end aur 
Company Name Strongest Area Jodia Bazar / Local Market Ke 
Lihaz Se Kamiyan (Flaws / 
Gaps) 
Enterprise Scale expensive hai. CMMI Level 5 
aur SOC 2 Type II compliance 
ke sath, in ka target large 
corporate enterprises aur mega 
distributors hain. Jodia Bazar 
ke darmiyanay tajir ke liye iski 
deployment, training, aur 
maintenance bohot pecheeda 
(overkill) hai. Informal market 
mein tezi se tabdeel hone 
walay daily workflows is mein 
adjust karna lag bhag 
namumkin hai. 
Candela (LumenSoft) Retail POS, Barcode, Offers, 
Stock Management 
Candela bunyadi tor par retail 
(apparel, footwear, pharmacy) 
ke liye behtareen hai jahan 
color, size, aur design matrix 
zaroori hota hai. Lakin FMCG 
wholesale aur distribution ke 
liye yeh kamzor par jata hai. Is 
mein desktop installations ke 
remote access aur updates ka 
masla rehta hai. DSR (Daily 
Sales Report) aur field force 
route tracking is ka core feature 
nahi hai, jo wholesale mein 
lazmi hai. 
Evamp & Saanga Salesman Field Force, Route 
Tracking, Telecom Solutions 
In ka focus custom enterprise 
software development, digital 
transformation, aur large 
telecom/fintech integrations par 
zyada hai. Ek off-the-shelf, 
sasta, aur asan wholesale ERP 
jo aam tajir (local trader) khud 
deploy kar sakay, in ke 
business model se match nahi 
karta. Yeh highly tailored 
solutions banate hain jo local 
market ke budget se bohot 
bahir hote hain. 
Abacus / SAP Global Tech, Enterprise Supply 
Chain, SAP Deployment 
SAP deployments mahinon 
(months) leti hain aur is ke liye 
puri ek IT team aur change 
management process darqar 
Company Name Strongest Area Jodia Bazar / Local Market Ke 
Lihaz Se Kamiyan (Flaws / 
Gaps) 
hota hai. Jodia bazar ke trader 
ko din mein hazaron 
transactions karni hoti hain 
jismein tax, billing, aur stock 
adjustments real-time, informal, 
aur flexible hoti hain. SAP aisi 
informal, fast-paced 
environment mein rigidly fail ho 
jata hai aur system ko block kar 
deta hai. 
Local ERPs (Moneypex, etc.) FBR Integration, Local Expense 
Approvals, Mobile App 
Aksar local ERPs pure 
cloud-based hote hain. Jodia 
bazar mein internet ki farahami 
hamesha barqarar nahi rehti; 
jab PTCL ya internet band hota 
hai toh cloud ERPs ruk jate 
hain. Dusra masla yeh hai ke 
yeh systems forcibly formal 
accounting standards thopte 
hain, jabke local market mein 
'Munshi' style ledger, 
'Bori/Carton' conversion, aur 
'Hamali/Palledari' jaise 
kharchay per-item map karna in 
cloud systems mein mushkil ho 
jata hai. 
In tamam kamiyon ko dekhte hue, Trader Desktop 2.0 ka bunyadi maqsad in tamam barray 
systems ki taqat (jaise Systems Ltd ka multi-tenant architecture aur Evamp & Saanga ka route 
tracking) ko ek aisay simple offline-first UI mein lana hai jo Candela ya Moneypex se bhi zyada 
asan ho aur khas tor par local market traders ke liye design kiya gaya ho. 
3. Technical Architecture Aur Multi-Tenant System Ki 
Tafseel 
Trader Desktop ek aam software nahi hai balke yeh ek mukammal Multi-Tenant SaaS (Software 
as a Service) application hai. Is architecture ko design karte waqt "Zero Data Loss" aur "High 
Performance" ko markazi haisiyat di gayi hai. 
3.1 Multi-Tenant Buniad Aur Database Isolation 
System ka backend Node.js aur Express.js par mabni hai, jismein tenant identification ka 
mukammal nizam mojud hai. Har wholesale company (jise hum Tenant kahenge) ka apna bilkul 
alag aur mehfooz (isolated) database hoga. Jab bhi koi user system mein login karta hai, toh 
backend ka authMiddleware.js JWT token ke zariye user ki 'companyId' extract karta hai. Is 
'companyId' ke bunyad par DatabaseManager.js ek makhsoos MongoDB Atlas database ka 
connection resolve karta hai. Is point-to-point isolation ka faida yeh hai ke ek trader ka data kisi 
bhi surat mein dusre trader ke data ke sath mix nahi ho sakta, aur data leaks ka khatra bilkul 
khatam ho jata hai. System mein connection pooling ka istemal kiya gaya hai (LRU-based 
cache ke zariye) taake hazaron tenants hone ke bawajood server par load na paray. Database 
level par har query mein automatically companyId ka filter lag jata hai, jo security ki ek mazeed 
layer faraham karta hai. 
3.2 Offline-First Sync Engine (Bina Internet Ke Karobar) 
Pakistan mein bijli aur internet ke masail aam hain. Agar software sirf cloud par ho, toh internet 
band hone ki surat mein dukaan ka kaam ruk jata hai, jis ka nuqsan hazaron rupay mein hota 
hai. Is maslay ko hal karne ke liye, Trader Desktop ko Electron.js framework par banaya gaya 
hai. Yeh software web browser mein chalne ke bajaye Windows par install hota hai aur native 
application ki tarah kaam karta hai. 
Is nizam ke andar ek local database (Realm SDK) integrated hai. Jab trader koi bhi entry karta 
hai—chahe wo nayi sale ho, stock update ho, ya payment receive ho—woh fauran local Realm 
database mein save ho jati hai. Yeh process milliseconds mein hota hai, jis ki wajah se software 
intahai tezi se kaam karta hai. Ek alag background service, jise hum 'Sync Engine' kehte hain 
(syncCore.js aur syncProcessor.js), musalsal internet connection ko monitor karti hai. Jaise hi 
internet connect hota hai, Sync Engine local database mein maujood naye records (jin par 
isSynced: false ka flag hota hai) ko MongoDB Atlas cloud ke sath automatically sync kar deta 
hai. 
Sync process ke doran agar koi conflict aata hai (misal ke taur par, ek hi product ki qeemat 
manager ne ghar baithe cloud par change ki, aur dukaandar ne offline system par bhi change 
kar di), toh system mein conflict resolution ki makhsoos strategies hain. By default, "Last Write 
Wins" ka asool lagta hai, yani jis ne aakhir mein change ki uski baat mani jayegi, lekin isay 
"Field Merge" ya manual resolution par bhi set kiya ja sakta hai. Har document mein metadata 
fields jaise v (version), lastModifiedAt, aur deviceId mojood hain jo is sync process ko error-free 
banate hain. 
3.3 Super Admin Panel Aur SaaS Management 
Kyunke yeh ek SaaS product hai, is liye isay bechne wali company ke liye ek "Super Admin" 
panel banaya gaya hai. Is panel ke zariye operators har tenant ki health, database load, AI API 
limits, aur subscription plans ko monitor kar sakte hain. Super Admin ko data ke andar jhankne 
ki ijazat nahi hoti (due to tenant database isolation), lekin woh metrics dekh sakta hai ke kis 
tenant ki sync fail ho rahi hai ya kon sa tenant limit se zyada storage use kar raha hai. Yeh 
architecture Systems Ltd ya Abacus jaisi bari IT companies ke setup se milta julta hai lakin 
deployment mein us se hazar guna asan hai. 
4. User Experience (UX) Aur Local Market Interface 
Design 
Pakistani mandiyon, khusoosan Jodia Bazar ya Akbari Mandi, ke traders ko modern software 
UI/UX principles se koi sarokar nahi hota. Unke liye behtareen UX wo hai jo unke kaam ki 
speed ko double kar de aur dekhne mein sada ho. Is PRD mein UX design ko bilkul minimalist 
aur function-oriented rakha gaya hai. 
4.1 UI Design Guidelines (Bina Faltu Themes Ke) 
Software mein koi pecheeda dark modes, heavy animations, ya 3D graphical dashboards nahi 
hain. Aisi cheezain puranay dual-core ya i3 computers par lag paida karti hain aur wholesale 
market ki fast pacing ko slow karti hain. Interface bilkul sada rakha gaya hai. Data grids aur 
tables ka zyada istemal kiya gaya hai jahan information high contrast mein nazar aaye. Screen 
par font size bara aur wazeh rakha gaya hai taake umar raseeda traders aur munshi hazrat 
asani se parh sakein. 
4.2 Keyboard-First Navigation Aur Bilingual Support 
Local market mein data entry operators aur munshi mouse ka istemal kam karte hain aur 
keyboard par unki ungliyan tezi se chalti hain. Is liye software ko "Keyboard-First" banaya gaya 
hai. Nayi sale banane ke liye F2, chalan banane ke liye F3, aur search ke liye Ctrl+F jaise 
shortcuts hard-coded hain. Pura sale ka process (Customer selection se lekar payment receipt 
tak) sirf Tab aur Enter keys ke zariye mukammal kiya ja sakta hai. 
Is ke ilawa, system mein vocabulary ko bilingual rakha gaya hai. Khata, Udhaar, Wapsi, 
Palledari, Bori, Peti jaise alfaz software mein default terms ke taur par use hote hain (ya asani 
se configure kiye ja sakte hain), jis se dukaandar ko lagta hai ke yeh software bilkul uske 
business ke liye hi banaya gaya hai. 
5. Stock Management, Inventory Aur Local Unit 
Calculations 
Retail software (jaise Candela) aur wholesale software mein sab se bara farq inventory map 
karne ka hota hai. Candela sizes aur colors manage karta hai, jabke Jodia Bazar mein trader ko 
Bori, Peti (Carton), aur andar mojood Dabbiyon ya pieces ka hisab rakhna hota hai. Yeh PRD is 
maslay ka ek mukammal aur gehra mathematical hal pesh karti hai. 
5.1 Hierarchical Unit Engine (Bori, Peti, Piece Conversion) 
System mein ek dynamic unit conversion engine banaya gaya hai jo multiple packaging levels 
ko handle karta hai. Jab naya product create kiya jata hai (ProductModel.js ke zariye), toh trader 
uski hierarchy define kar sakta hai: 
1. Base Unit (Piece/Dabbi): Sab se choti ikai. 
2. Secondary Unit (Peti/Carton): Misal ke taur par, 1 Peti = 12 Pieces. 
3. Tertiary Unit (Bori/Sack): Misal ke taur par, 1 Bori = 10 Peti (Yani 120 Pieces). 
System backend par stock ko hamesha "Base Unit" (Pieces) mein save rakhta hai. Lekin 
frontend par trader ko uski asani ke liye convert kar ke dikhata hai. Agar godown mein 150 
pieces mojood hain, toh dashboard par yeh "1 Bori, 2 Peti, aur 6 Pieces" ke taur par nazar 
aayega. Jab trader nayi purchase enter karta hai aur "2 Bori" likhta hai, toh system dynamically 
usay 240 pieces mein convert kar ke stock level ko update kar deta hai. Yeh feature local 
market mein hisab kitab ki bohot bari confusion ko khatam kar deta hai. 
5.2 Landed Cost Calculation (Palledari, Hamali, Aur Tulai) 
Yeh is system ka sab se mazboot hissa hai aur woh maqam hai jahan zyadatar international 
ERPs aur Candela fail ho jate hain. Jab trader market se truck bhar kar maal mangwata hai, toh 
sirf product ki qeemat uski total laagat (cost) nahi hoti. Us maal ko truck se utarne aur godown 
tak pohanchane ki labor lagti hai jise "Palledari" ya "Hamali" kehte hain. Us ke ilawa wazan 
karne ka kharcha "Tulai" hota hai, aur agar safai ki zaroorat ho toh "Garda" ke charges kat-te 
hain. 
Aam software in charges ko general business expense mein daal dete hain, jis ki wajah se 
per-product cost aur profit ka formula ghalat ho jata hai. Trader Desktop mein "Purchase Entry" 
ke doran ek makhsoos "Landed Cost Allocator" banaya gaya hai. Iska mathematical workflow 
yeh hai: 
1. Trader supplier ki invoice enter karta hai (e.g., 100 Peti of Product A @ Rs. 1000 each = 
Rs. 100,000). 
2. Trader "Direct Expenses" section mein truck ka Kiraya (Freight: Rs. 5000), Palledari 
(Labor: Rs. 1000), aur Tulai (Weighment: Rs. 500) darj karta hai. 
3. System in tamam expenses ka total karta hai (Total Extra Cost = Rs. 6500). 
4. System is Rs. 6500 ko total pieces par proportionally distribute (taqseem) kar deta hai. 
5. Nayi "Landed Cost" automatically calculate ho jati hai, aur system isi landed cost ki 
bunyad par aage aane wali sales ka munafa (profit) calculate karta hai. Is tarah trader ko 
apni jeb se hone wale har aik rupay ka durust hisab milta hai. 
5.3 Stock Notifications, Wastage Aur Categorization 
Inventory system bilkul real-time hai. Har sale ke baad, triggerLowStockNotification() 
background mein check karta hai ke kon sa item apne minimum level se neechay chala gaya 
hai, aur fauran dashboard par alert bhejta hai. Wholesale market mein saman ki tootti-phooti ya 
chuho se kharab hone ka masla aam hai. Is ke liye "Damage Adjustment" ya "Wastage" ka form 
mojud hai. Jab trader wastage enter karta hai, toh woh maal stock se nikal jata hai aur financial 
ledger mein loss book ho jata hai. Barcode aur QR code generation ka mukammal support 
mojud hai, jisse Peti ya Bori par sticker lagaya ja sakta hai taake godown mein dhoondna asan 
ho. 
6. Sales Module (Tez Tareen Farokht Ka Nizam) 
Sale module kisi bhi B2B wholesale aur distribution software ka dil hota hai. Local market mein 
aik din mein saikron bills bantay hain, aur agar software ek bill banane mein 2 minute lay, toh 
karobar tabah ho sakta hai. Is PRD mein sale workflow ko is tarah design kiya gaya hai ke 
operator 30 seconds se kam waqt mein puri invoice mukammal kar sakay. 
6.1 Sale Creation Process Aur Credit Checks 
Sale banane ka workflow intahai structured magar flexible hai: 
1. DSR Assignment: Har sale ek makhsoos "Daily Sales Report" (DSR) number se link hoti 
hai. Yeh is liye zaroori hai taake pata chal sakay ke kis salesman ki sheet par yeh sale 
jani hai. 
2. Customer Selection (Cash vs. Udhaar): Agar sale "Cash" par hai, toh customer ka 
naam dalna zaroori nahi, usay "Walk-in" consider kiya jayega. Lekin, agar terms "Credit" 
(Udhaar) hain, toh system lazmi taur par kisi registered customer ko select karne ka 
kahega. 
3. Dynamic Credit Limits: Har customer ke profile mein ek "Credit Limit" (udhaar ki hadd) 
set hoti hai. Jaise hi operator udhaar ka naya bill banata hai, system check karta hai: 
(Maujooda Outstanding Balance + Naye Bill Ka Amount). Agar yeh calculation customer 
ki set ki gayi credit limit se tajawuz karti hai, toh system fauran rok deta hai aur "Credit 
Limit Exceeded" ka error deta hai. Is bill ko aage badhane ke liye Manager ya Owner ka 
password/authorization darkar hota hai. 
4. Item Selection Aur Pricing Matrix: Items ko barcode scanner ke zariye scan kiya ja 
sakta hai ya keyboard se naam search kar ke add kiya ja sakta hai. System mein 
customer tiers ke hisab se automatic pricing lagti hai. Misal ke taur par, agar customer 
"Wholesaler" hai toh software automatically wholesale price layega, aur agar "Retailer" 
hai toh retailer price layega. Item level discount aur bill level total discount dono options 
aik sath available hain. 
6.2 Returns Management (Wapsi Ka Nizam) 
Distribution aur wholesale mein expire hone walay products ya kharab maal ki wapsi karobar ka 
lazmi hissa hai. Returns management module bilkul seedha aur asan hai. Jab dukaandar maal 
wapas karta hai, toh operator "Create Return" page kholta hai aur original invoice number dalta 
hai. System original invoice ki tafseel dikhata hai, jahan operator wapas aane wali quantity darj 
karta hai. 
System automatically refund amount calculate karta hai. Wapas aane wala maal godown ke 
stock mein dobara jama (add) ho jata hai, aur sab se eham baat, customer ke financial ledger 
(khate) mein reverse entry pass ho jati hai, taake uska udhaar utni raqam se kam ho jaye. Yeh 
process pehle kaghazon par kaat-peet (cancellations) ke zariye hota tha jis mein bohot 
ghaltiyan hoti theen. 
6.3 Quick POS (Counter Sales) 
Barray orders ke ilawa, baz oqaat chotay dukaandar counter par aakar naqad maal khareedte 
hain. Is ke liye system mein ek alag "Quick POS" screen di gayi hai, jiska UI Candela jaisa 
touch-friendly aur barcode-driven hai. Yeh screen bina extra details mangay tezi se payment 
process karti hai aur choti thermal slip print kar deti hai. 
7. Delivery Challan System (Maal Ki Tarseel Aur 
Logistics) 
Sale invoice aur Delivery Challan mein bunyadi farq hota hai. Invoice peson ka hisab hai jis 
mein tax aur price likhi hoti hai, jabke Delivery Challan godown keeper (store incharge) ke liye 
ek raseed hoti hai jis par likha hota hai ke kon sa maal kis gari mein rakh kar bhejna hai. 
Abacus ya SAP mein logisitics management bohot complex hoti hai , lakin yahan isay 
ground-reality ke mutabiq asan rakha gaya hai. 
7.1 Challan Structure Aur Logistics Info 
Challan create karte waqt DSR number ko link kiya jata hai. Is ke baad "Logistics Information" 
dali jati hai, jis mein Gari ka number (Vehicle No), Driver ka naam, aur us route ki tafseel hoti hai 
jahan maal bheja ja raha hai. 
7.2 Required Qty vs. Supplied Qty 
Baz oqaat order 10 Peti ka hota hai, lakin godown mein us waqt sirf 8 Peti hoti hain. Challan 
system is reality ko accept karta hai. Frontend UI mein "Required Qty" 10 nazar aayegi. 
Godown keeper "Supplied Qty" mein 8 darj karega, aur system automatically "Shortage Qty" ko 
2 kar dega. Is tarah sale bill aur delivery mein hone walay farq ka record ban jata hai aur baad 
mein inventory audit mein masla nahi hota. 
7.3 Status Lifecycle Tracking 
Delivery challan ki mukhtalif halat (statuses) hoti hain jo dashboard par color-coded badges ke 
zariye nazar aati hain : 
● Pending: Challan ban gaya hai lakin godown se gari par load nahi hua. 
● Dispatched: Maal gari par load ho kar nikal chuka hai. 
● Delivered: Dukaandar tak maal theek se pohanch gaya hai. 
● Partially Delivered: Agar raste mein kuch maal kharab ho gaya ya dukaandar ne lene se 
inkar kar diya. 
● Returned: Pura maal wapas aa gaya hai. 
Har status change ki ek timeline maintain hoti hai, jis mein timestamp aur user ka naam save 
hota hai. Is database tiered indexing (misal ke taur par companyId + status + isDeleted) ki 
wajah se hazaron challans mein se sirf 'Pending' challans ko milliseconds mein dhoondha ja 
sakta hai. 
8. Salesman Field Force Aur DSR (Daily Sales Report) 
Management 
FMCG (Fast-Moving Consumer Goods) distribution networks mein salesmen ka role reerh ki 
haddi (backbone) ki tarah hota hai. Evamp & Saanga aur Moneypex jaisi companies field 
tracking mein aagay hain, kyunke order booking aur recovery direct field se hoti hai. Trader 
Desktop ne in features ko ek desktop-first environment mein DSR management ke zariye 
integrate kiya hai. 
8.1 DSR Ka Nizam (Daily Sales Report) 
Subah jab salesman duty par aata hai, toh uske naam par ek khali (Empty) DSR number 
generate kiya jata hai (e.g., DSR-20260621-ALI-001). Is DSR ke sath ek Route ya Beat plan 
assign kiya jata hai. Din bhar mein jitni bhi sales, returns, ya cash collections Ali (salesman) 
karta hai, woh sab is DSR number ke sath link hoti rehti hain. 
8.2 Currency Breakdown (Note Ki Tafseel) 
Pakistani market ka ek intahai khalis feature yeh hai ke shaam ko jab salesman hisab dene 
(settlement) aata hai, toh usay cash gin kar dena hota hai. Munshi ko note ki tafseel leni hoti hai 
ke 5000 ke kitne note hain aur 1000 ke kitne hain. System mein DSR settlement form ke andar 
ek "Currency Denomination Breakdown" ka module banaya gaya hai. Yahan salesman enter 
karta hai: 
● n5000 = 10 (Total: Rs. 50,000) 
● n1000 = 20 (Total: Rs. 20,000) 
● n500 = 50 (Total: Rs. 25,000) System inko automatically jama karta hai aur check karta 
hai ke "Total Cash Received" aur gine hue notes barabar hain ya nahi. Yeh feature local 
market mein hisab kitab ko verify karne aur cash handling ke fraud se bachne mein bohot 
madadgar sabit hota hai. 
8.3 Salesman Expense Tracking 
Field mein salesman ke kharchay aam baat hain, jaise gari ka petrol, CNG, labor ko diya gaya 
paisa, khana (food/tea), aur parking fees. DSR module ke andar salesman apne yeh din bhar ke 
kharchay record karta hai. System in kharchon ko total collection mein se minus kar ke "Net 
Amount to Deposit" nikalta hai. 
8.4 Comprehensive Salesman Sheet Generator 
Din ke aakhir mein, dsrSalesmanSheetController ek mukammal aur tafseeli report generate 
karta hai jise print kiya ja sakta hai. Is sheet mein shamil hota hai: 
● Total Farokht (Sales summary product-wise) 
● Udhaar aur Naqad ka farq (Cash vs Credit) 
● Kitna discount diya gaya 
● Wapsi ka record (Returns) 
● Kul expenses aur Net Cash to Company. Yeh sheet puranay kaghazi registers ka 
mukammal digital aur error-free mutabadil (alternative) hai. 
9. Khata (Ledger), ERP Aur Financial Management 
Local market mein 'Munshi' ka asal kaam pakka khata (Ledger) maintain karna hota hai, jahan 
se pata chalta hai ke kis dukaandar ne kitne paise dene hain aur kis supplier ko kitne paise 
dene baqi hain. Rigid ERPs (jaise SAP) yahan fail ho jate hain kyunke unka double-entry 
system ghalti theek karne ki asan ijazat nahi deta. Trader Desktop is process ko flexible aur 
asan banata hai. 
9.1 Customers Aur Vendors Ka Khata (Ledgers) 
Har transaction, chahe woh sale ho, purchase ho, ya return ho, seedha background mein 
Financial Ledger (transactions collection) ko update karti hai. Jab dukaandar udhaar par maal le 
jata hai, toh uske khate mein debit balance barh jata hai. Jab woh payment karne aata hai 
(Cash, Bank Transfer, ya Cheque ke zariye), toh operator "Payment Receive" entry karta hai, 
aur outstanding balance foran kam ho jata hai. 
9.2 WhatsApp Khata Sharing Integration 
Local traders dukaandar ko har roz paper print nikal kar dene se katrate hain. Is liye system 
mein WhatsApp API service (whatsappService.js) shamil ki gayi hai. Ek single click par, 
customer ke pure mahine ka khata (Ledger Statement) PDF format mein generate hota hai aur 
seedha uske WhatsApp number par chala jata hai. Yeh feature recovery process ko bohot tez 
kar deta hai aur disputes ko kam karta hai. 
9.3 Expense Approvals (Maker-Checker System) 
Karobar ke aam kharchay (jaise godown ka kiraya, bijli ka bill, staff ki salary, ya mehmanon ka 
chai-pani) enter karne ke liye ek business expense module hai. Is mein security ke liye 
"Maker-Checker" concept apply kiya gaya hai. Jab ek data entry operator koi expense enter 
karta hai, toh uski status "Pending" hoti hai aur woh khate mein se paise nahi katta. Jab Owner 
ya authorized Manager apni screen se usay review kar ke "Approve" karta hai (jis mein 
approvedBy aur approvedAt tags lagte hain), tab ja kar woh raqam business accounts se 
deduct hoti hai. Agar expense be-ja ho, toh woh rejection note ke sath "Reject" kiya ja sakta hai. 
10. Print Engine Aur Invoicing Capabilities 
Pakistan ki wholesale market mein print nikale bina maal ki tarseel na-mumkin hai. Candela aur 
deegar retail softwares mein aam taur par browser base printing hoti hai jo user se baar baar 
print dialog khulwati hai, jismein har bill par extra 5-10 seconds zaya hote hain. 
10.1 Electron Native Printing (Silent Mode) 
Trader Desktop mein printing ke liye system ko Electron ki native IPC handlers (main.js mein 
get-printers aur print-document) ke zariye jora gaya hai. Is ka faida yeh hai ke jab operator 
"Save & Print" par click karta hai, toh koi popup nahi aata. System background (Silent Mode) 
mein makhsoos printer ko directly command bhejta hai aur foran print nikal aata hai. Yeh 
milliseconds ki bachat din bhar ki saikron invoices mein ghanton ka waqt bachati hai. 
10.2 Invoice Template Editor (Visual Builder) 
Har wholesale karobar ka bill design alag hota hai. Koi thermal receipt use karta hai toh koi 
bada A4 size ka kaghaz. Is system mein ek powerful "Invoice Template Editor" mojud hai. 
● Template Types: Thermal (58mm/80mm) choti receipts ke liye, aur A4/Letter size 
wholesale bulk orders ke liye. 
● Customization: Visual drag-and-drop editor ke zariye trader apna company logo, terms 
and conditions, aur digital signature khud set kar sakta hai. 
● Server-Side PDF Generation: Agar customer ko bill email ya WhatsApp karna ho, toh 
backend par Puppeteer library ek perfect A4 PDF generate karti hai jo background colors 
aur styling ke sath hoti hai. 
11. Security Layer, Role-Based Access, Aur 
Future-Proofing 
System ki hifazat aur lachak (flexibility) usay dosre local softwares se mumtaz karti hai. 
11.1 Security Aur Roles (RBAC) 
Trader Desktop mein 5 darjon par mabni Role-Based Access Control (RBAC) mojud hai : 
1. SUPER_ADMIN: System owner jo tamam tenants ko dekhta hai. 
2. ADMIN: Tenant company ka owner, jise har cheez ka access hai. 
3. MANAGER: Sales, purchases, aur expense approve kar sakta hai. 
4. SALES (Salesman): Sirf bill bana sakta hai. Is level par data mask kiya jata hai; misal ke 
taur par, salesman kisi product ki asli laagat (purchase cost) nahi dekh sakta, woh sirf 
sale price dekh sakta hai. 
5. VIEWER: Sirf reports dekh sakta hai, koi tabdeeli nahi kar sakta. 
Har tabdeeli (edit ya delete) par background mein ek statusHistory ya Audit Log maintain hota 
hai. Agar koi bill delete bhi ho jaye (Soft delete: isDeleted = true), toh woh database se 
completely khatam nahi hota, balke 90 din tak audit trail mein mojood rehta hai taake manager 
review kar sakay. NoSQL injection, CSRF tokens, aur Rate Limiting jaisi standard API security 
layers Helmet aur express-mongo-sanitize ke zariye integrated hain. 
11.2 AI Assistant (Jarvis) Ka Mahdood Istemal 
System mein Gemini AI par mabni "Jarvis" assistant diya gaya hai. Lakin local market ki nature 
ko dekhte hue isay bohot zyada complex nahi banaya gaya. Yeh basic voice ya text commands 
samajhta hai, jaise "Aaj ki total cash collection dikhao" ya "Konsa item stock mein khatam hone 
wala hai". Yeh operator ko report dhoondne mein waqt zaya karne se bachata hai. 

---

# PART II — TECHNICAL ENHANCEMENT & IMPLEMENTATION SPECIFICATION (English)

The following sections expand the original product vision with comprehensive technical
specifications, implementation requirements, and architectural decisions. All content below is
written in English to serve as the authoritative technical reference for development teams and
AI agents working on the project.

---

## 12. Project Identity & Naming

| Attribute | Value |
|---|---|
| Product Name | Trader Desktop |
| Internal Codename | newtrade |
| Product Type | B2B/B2C SaaS Multi-Tenant ERP (Web + Desktop) |
| Target Market | Pakistani Wholesale Markets (Jodia Bazar, Akbari Mandi, FMCG Distribution) |
| Primary Platform | Web (MERN Stack) with optional Electron Desktop wrapper |
| Deployment Target | Vercel (Web) + Electron Build (Desktop) |

## 13. Technology Stack Decision Matrix

The project is built on the MERN stack (MongoDB, Express, React, Node.js) using the latest
stable versions of every package. The stack was selected to balance developer productivity,
scalability, and the multi-tenant database-per-tenant isolation model.

### 13.1 Frontend Stack

| Layer | Technology | Version Policy |
|---|---|---|
| UI Framework | React (latest stable) | Always latest stable |
| Build Tool | Vite | Always latest stable |
| Styling | Tailwind CSS + custom CSS | Always latest stable; NO Bootstrap |
| State Management | React Context + Hooks (global stores) | Lightweight, no over-engineering |
| Routing | React Router DOM | Always latest stable |
| HTTP Client | Axios (with interceptor layer) | Always latest stable |
| Form Handling | React Hook Form | Always latest stable |
| Charts | Recharts or Chart.js | Always latest stable |
| Icons | Lucide React (professional icon set) | Always latest stable |
| Notifications | React Hot Toast or Sonner | Always latest stable |

### 13.2 Backend Stack

| Layer | Technology | Version Policy |
|---|---|---|
| Runtime | Node.js (latest LTS) | Always latest LTS |
| Framework | Express.js | Always latest stable |
| Database | MongoDB Atlas (cloud) | Managed service |
| ODM | Mongoose | Always latest stable |
| Authentication | JWT (jsonwebtoken) + Refresh Tokens | Always latest stable |
| Validation | Joi or express-validator | Always latest stable |
| File Upload | Multer + Cloudinary | Always latest stable |
| Security | Helmet, express-mongo-sanitize, cors, express-rate-limit | Always latest stable |
| PDF Generation | Puppeteer (server-side) | Always latest stable |
| Messaging | WhatsApp Business API (Cloud) | External service |
| AI | Google Gemini API | External service |
| Cache | Redis (optional, graceful degradation) | External service |

### 13.3 Desktop & Offline Layer

| Layer | Technology | Purpose |
|---|---|---|
| Desktop Wrapper | Electron.js | Native Windows application |
| Local Database | Realm SDK (offline-first) | Local data persistence without internet |
| Sync Engine | Custom syncCore.js + syncProcessor.js | Bi-directional cloud sync |

## 14. Technical Architecture — Expanded

### 14.1 Multi-Tenant Database Isolation Model

The system implements a database-per-tenant isolation strategy. Each wholesale company
(tenant) receives its own dedicated MongoDB Atlas database. This provides the strongest
data isolation boundary available in MongoDB.

**Tenant Resolution Flow:**
1. User authenticates and receives a JWT containing `companyId`.
2. `authMiddleware.js` decodes the JWT and extracts `companyId`.
3. `DatabaseManager.js` resolves the correct database connection using an LRU-based
   connection pool cache.
4. Every subsequent query in the request lifecycle is scoped to the resolved database.
5. A `companyId` filter is applied automatically as a secondary security layer on every
   query, even within the isolated database.

**Connection Pooling:** An LRU cache manages database connections so that frequently
active tenants maintain warm connections while idle connections are evicted, preventing
connection exhaustion at scale.

### 14.2 Offline-First Sync Engine (Detailed)

The sync engine is the heart of the offline-first architecture for the desktop application.

**Local Write Flow (Offline):**
1. User performs an action (sale, purchase, payment, stock update).
2. Data is written to the local Realm database with `isSynced: false`.
3. The UI updates instantly (milliseconds response time).
4. A background Sync Engine monitors connectivity status.

**Sync Flow (When Online):**
1. Sync Engine detects internet restoration.
2. It queries Realm for all records where `isSynced: false`.
3. Records are batched and pushed to MongoDB Atlas in chronological order.
4. Server processes each batch, updates `isSynced: true` on success.
5. Any server-side changes (e.g., manager edits from another device) are pulled down.

**Conflict Resolution Strategies:**
- Default: Last Write Wins (LWW) — the most recent `lastModifiedAt` timestamp wins.
- Configurable: Field Merge — non-overlapping field changes are merged automatically.
- Manual: Flagged conflicts are surfaced to the manager for manual resolution.

**Metadata Fields on Every Document:**
- `v` (version number for optimistic concurrency)
- `lastModifiedAt` (ISO timestamp)
- `deviceId` (originating device identifier)
- `isSynced` (boolean sync flag)
- `syncedAt` (timestamp of last successful sync)

### 14.3 Image & File Storage Strategy

All images and file uploads are stored on Cloudinary. Only the Cloudinary secure URL and
metadata paths are persisted in MongoDB Atlas. This keeps the database lightweight and
leverages Cloudinary's CDN for fast delivery.

**Files managed via Cloudinary:**
- Product images
- Company logos (for invoice templates)
- User profile avatars
- Supplier/customer document attachments
- Generated PDF statements (when email/WhatsApp delivery is required)

### 14.4 Environment Configuration

All credentials and environment-specific configuration are controlled via `.env` files. No
secrets are ever hardcoded. The frontend uses `VITE_` prefixed variables and the backend
uses standard Node.js environment variables. See `VERCEL_DEPLOY.md` for the complete
environment variable reference.

## 15. Module Specification — Expanded Requirements

### 15.1 Stock & Inventory Module

**Hierarchical Unit Engine:**
- Base Unit (Piece/Dabbi): smallest unit, stored as the canonical stock value.
- Secondary Unit (Peti/Carton): e.g., 1 Peti = 12 Pieces.
- Tertiary Unit (Bori/Sack): e.g., 1 Bori = 10 Peti = 120 Pieces.
- Backend always stores stock in base units (pieces).
- Frontend converts and displays in the most readable hierarchical format.
- Conversion ratios are configurable per product.

**Landed Cost Calculation:**
- Direct expenses (Freight, Palledari, Hamali, Tulai) are allocated proportionally across
  all items in a purchase batch.
- Formula: `Landed Cost per Piece = (Invoice Cost + Total Extra Cost) / Total Pieces`.
- Profit margins are calculated against landed cost, not raw invoice cost.

**Stock Operations:**
- Purchase entry (with landed cost allocator)
- Sale deduction (automatic on invoice creation)
- Return re-addition (automatic on return processing)
- Wastage / Damage adjustment (removes stock, books as loss)
- Stock transfer between godowns (multi-location support)
- Barcode / QR code generation for packaging labels
- Low-stock threshold notifications (real-time trigger)

### 15.2 Sales Module

**Sale Creation Workflow:**
1. DSR number auto-linked (or manually assigned).
2. Customer selection: Cash (walk-in, no customer required) or Credit (registered customer
   required with credit limit check).
3. Credit limit enforcement: `Outstanding Balance + New Bill Amount` must not exceed the
   customer's configured credit limit. Override requires Manager/Owner authorization.
4. Item entry via barcode scan or keyboard search.
5. Tier-based auto-pricing (Wholesaler price, Retailer price, custom tier price).
6. Item-level discount + bill-level total discount (both available simultaneously).
7. Save & Print (silent thermal/A4 print via Electron IPC, or browser print for web).

**Target Performance:** Complete invoice in under 30 seconds via keyboard-only navigation.

### 15.3 Returns Module

- Return initiated by referencing original invoice number.
- System displays original line items for selection.
- Operator enters return quantity per item.
- Refund amount auto-calculated.
- Returned stock re-added to inventory.
- Customer ledger receives reverse (credit) entry.
- Full audit trail maintained.

### 15.4 Quick POS Module

- Touch-friendly, barcode-driven counter sales screen.
- Minimal required fields for speed.
- Thermal receipt printing (58mm/80mm).
- Cash payment by default; customer optional.

### 15.5 Delivery Challan Module

**Challan Fields:** DSR number, vehicle number, driver name, route details, line items with
Required Qty vs. Supplied Qty, shortage auto-calculation.

**Status Lifecycle:** Pending → Dispatched → Delivered (or Partially Delivered / Returned).
Each status change is timestamped with the acting user's name. Color-coded badges on the
dashboard. Indexed by `companyId + status + isDeleted` for millisecond filtering.

### 15.6 DSR (Daily Sales Report) Module

- Auto-generated DSR number per salesman per day (format: `DSR-YYYYMMDD-NAME-###`).
- Route/Beat plan assignment.
- Links all sales, returns, and cash collections for the day.
- Currency denomination breakdown (note counting verification).
- Salesman expense tracking (fuel, food, parking, labor).
- Net deposit calculation: `Total Collection - Total Expenses`.
- Printable end-of-day salesman sheet (product-wise sales, cash vs. credit, discounts,
  returns, expenses, net cash).

### 15.7 Khata (Ledger) & Financial Module

- Every transaction (sale, purchase, return, payment) auto-updates the financial ledger.
- Customer ledger: debit on credit sale, credit on payment received.
- Vendor ledger: credit on purchase, debit on payment made.
- Payment methods: Cash, Bank Transfer, Cheque.
- WhatsApp ledger sharing: one-click PDF generation + WhatsApp API delivery.
- Business expense module with Maker-Checker approval workflow.
- Soft delete with 90-day audit trail retention.

### 15.8 Print Engine Module

- Electron native silent printing (no dialog popup) for desktop.
- Browser-based printing fallback for web.
- Invoice Template Editor: drag-and-drop visual builder.
- Template types: Thermal (58mm/80mm) and A4/Letter.
- Customization: company logo, terms & conditions, digital signature.
- Server-side PDF generation via Puppeteer for email/WhatsApp delivery.

## 16. Security & RBAC — Expanded

### 16.1 Role Matrix

| Capability | SUPER_ADMIN | ADMIN | MANAGER | SALES | VIEWER |
|---|---|---|---|---|---|
| View all tenants | Yes | No | No | No | No |
| Manage tenant settings | Yes | Yes | No | No | No |
| Manage users & roles | Yes | Yes | Yes | No | No |
| Create sales | Yes | Yes | Yes | Yes | No |
| Approve expenses | Yes | Yes | Yes | No | No |
| View purchase cost | Yes | Yes | Yes | No (masked) | No (masked) |
| View reports | Yes | Yes | Yes | Limited | Yes |
| Delete records | Yes | Yes | No | No | No |

### 16.2 Security Layers

- JWT access tokens (short-lived) + refresh tokens (long-lived).
- Field-level encryption for sensitive data (FIELD_ENCRYPTION_KEY).
- NoSQL injection prevention (express-mongo-sanitize).
- CSRF protection tokens.
- Rate limiting on auth and write endpoints.
- Helmet for secure HTTP headers.
- Soft delete (isDeleted flag) with 90-day audit trail.
- statusHistory / audit log on every edit and delete.
- Client-side storage encryption (VITE_STORAGE_ENCRYPTION_KEY).

## 17. UX & Design — Implementation Constraints

- Minimalist, function-oriented UI — no heavy animations, no 3D dashboards, no complex
  theme switching.
- High-contrast data grids and tables as the primary information display.
- Large, readable font sizes for elderly operators.
- Keyboard-first navigation with hardcoded shortcuts (F2 = New Sale, F3 = Challan,
  Ctrl+F = Search, Tab/Enter for full sale flow).
- Bilingual vocabulary: Khata, Udhaar, Wapsi, Palledari, Bori, Peti as default terms.
- Responsive design via Tailwind CSS + custom CSS only. NO Bootstrap.
- Theme layout changes will NOT be implemented to avoid theme-related issues. A single,
  stable, professional theme is maintained.
- Professional icon set (Lucide React) — no amateur or generic AI-generated icons.
- NO native browser alert() or confirm() — all confirmations use custom modals.

## 18. Development Methodology & Milestones

The project follows a milestone-based development approach. Each milestone is a self-
contained deliverable that can be tested and demonstrated independently.

| Milestone | Scope | Deliverable |
|---|---|---|
| M0 | Project scaffolding, env config, base folder structure | Runnable empty app |
| M1 | Auth system, RBAC, multi-tenant DB manager | Login + tenant isolation |
| M2 | Product & stock management, unit engine, landed cost | Inventory CRUD |
| M3 | Sales module, Quick POS, pricing tiers, print | Invoice creation |
| M4 | Returns, delivery challan, status lifecycle | Logistics flow |
| M5 | DSR, currency breakdown, salesman sheet | Field force management |
| M6 | Khata/ledger, payments, expense approvals | Financial core |
| M7 | WhatsApp sharing, print template editor, PDF | Communication & print |
| M8 | Dashboard, reports, Jarvis AI assistant | Analytics & AI |
| M9 | Offline sync engine (desktop), Electron build | Desktop offline-first |
| M10 | Testing, optimization, deployment, documentation | Production release |

## 19. Architecture Principles (Binding Constraints)

1. **Modular Structure:** Strict adherence to the `client/` and `server/` folder structure.
   Everything categorized into proper routes, models, controllers, services, and middleware.
2. **File Size Limits:** Backend files must not exceed 120 lines. Frontend components must be
   split into small, reusable units — no 1200-line monoliths.
3. **Reusable Global Components:** Time-consuming features must be abstracted into reusable
   global components (e.g., DataTable, FormModal, ConfirmDialog, SearchableSelect).
4. **No Dummy Code:** Every implementation must be fully functional, secure, and production-
   ready. No placeholders, no fake data, no stub functions.
5. **No Comments:** No comments in generated code (per rules.md).
6. **Latest Versions Only:** Every installed package must be the latest stable version.
7. **Env-Driven Configuration:** All credentials via `.env` files — never hardcoded.
8. **Single Theme:** No theme switching/layout changes. One stable professional theme.

## 20. Acceptance Criteria Summary

- A wholesale trader can create a credit sale invoice in under 30 seconds using keyboard only.
- Stock is always stored in base units and displayed in hierarchical (Bori/Peti/Piece) format.
- Landed cost is automatically calculated with proportional expense allocation.
- Credit limit enforcement blocks over-limit sales without manager override.
- Offline desktop operations sync to cloud automatically when connectivity is restored.
- Multi-tenant isolation guarantees zero data leakage between tenants.
- Silent printing produces a receipt in under 2 seconds with no dialog interruption.
- WhatsApp ledger sharing delivers a PDF statement in a single click.
- All 5 RBAC roles enforce their permission boundaries without exception.
- The application is responsive across desktop, tablet, and mobile via Tailwind CSS.

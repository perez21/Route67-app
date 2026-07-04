# Route 67 — plateforme d'entraide Entrée express

Site d'information, de suivi personnalisé et d'entraide communautaire pour
l'Entrée express canadienne, destiné au Cameroun et à l'Afrique centrale.

Stack : **Next.js 14 (App Router) + PostgreSQL + Prisma**, en TypeScript,
avec assistant IA (Claude / Anthropic) et envoi d'email (Resend) intégrés
côté serveur.

## 1. Installer

```bash
npm install
cp .env.example .env
```

Ouvre `.env` et renseigne au minimum :
- `DATABASE_URL` : ta base PostgreSQL (voir section 2)
- `JWT_SECRET` : une valeur aléatoire forte, ex. générée avec `openssl rand -base64 32`

Facultatif mais recommandé :
- `ANTHROPIC_API_KEY` : active l'assistant IA candidat et la pré-rédaction d'actualités.
- `RESEND_API_KEY` + `EMAIL_FROM` : active l'envoi réel des emails (vérification
  d'adresse, réinitialisation de mot de passe, instructions de paiement Premium,
  notification et réponse aux messages de contact). **Sans clé, les liens de
  vérification/réinitialisation sont générés mais jamais envoyés** — utile en
  développement (le lien apparaît dans les logs serveur), à activer avant un
  vrai lancement.
- `ADMIN_CONTACT_EMAIL` / `ADMIN_WHATSAPP_NUMBER` : coordonnées affichées sur `/contact`
  et utilisées pour la confirmation manuelle des paiements Premium.
- `MOMO_ORANGE_NUMBER` / `MOMO_MTN_NUMBER` / `MOMO_ACCOUNT_NAME` : numéros et nom du
  titulaire Mobile Money affichés aux utilisateurs qui demandent le forfait Premium.
- `SOCIAL_FACEBOOK_URL` / `SOCIAL_INSTAGRAM_URL` / `SOCIAL_LINKEDIN_URL` / `SOCIAL_TIKTOK_URL` :
  liens affichés en pied de page (un réseau sans URL n'est simplement pas affiché).

Sans ces clés, les fonctionnalités concernées répondent avec un message clair
(ou continuent d'afficher l'information à l'écran) plutôt que de casser le
reste du site — voir sections 5 et 6.

## 2. Base de données

```bash
npx prisma migrate dev --name init
npm run prisma:seed
```



## 3. Lancer en développement

```bash
npm run dev
```

Le site est disponible sur http://localhost:3000.

## 4. Fonctionnalités incluses

### Deux forfaits seulement
- **Gratuit** : actualités, tirages, simulateur CRS complet, suivi de dossier avec
  dates, assistant IA (quota limité).
- **Premium** (8 000 FCFA/mois, soutien financier au projet) : tout le Gratuit +
  **forum d'entraide** et **rendez-vous planifiés avec l'équipe**, réservés
  exclusivement à ce forfait + quota IA plus large. La demande de forfait Premium
  envoie un email (si configuré) avec les numéros Mobile Money et le nom du
  titulaire ; la personne confirme ensuite son paiement dans l'app (référence +
  nom optionnel), par email ou par WhatsApp — un admin valide dans
  `/admin/utilisateurs`. Le forfait **se réinitialise automatiquement en Gratuit
  après 1 mois** (`User.tierExpiresAt`, vérifié à chaque connexion — voir
  `expirePremiumIfNeeded` dans `src/lib/session.ts`) : il faut renouveler la
  demande chaque mois.

### Forum modéré
Un administrateur crée un sujet directement visible ; un membre **Premium peut
aussi proposer un sujet**, qui reste en attente (`ForumTopic.status = PENDING`)
tant qu'un admin ne le valide pas dans `/admin/forum`. L'équipe peut à tout
moment **supprimer un message inadéquat** (bouton dans le fil, ou
`/admin/forum`) et **marquer un avertissement** sur un compte
(`User.warned` / `warningReason`, géré dans `/admin/utilisateurs`) — le
badge ⚠ apparaît alors à côté du nom dans tout le forum. Chaque message peut
recevoir des **réponses imbriquées** (`ForumPost.parentId`, un niveau de
profondeur), repliées par défaut derrière un compteur cliquable pour garder
le fil court. L'ensemble du fil reste dans un **cadre unique à défilement
interne** (`ForumThread.tsx`) qui **s'actualise automatiquement** après
chaque envoi (nouvel appel API, sans recharger la page).

### Rendez-vous Premium
Chaque plage hebdomadaire ouverte par l'admin (ex. 09:00–12:00) est découpée
en créneaux précis de **30 minutes**, chacun rattaché à une date exacte —
une seule heure correspond à un jour donné, sans ambiguïté. L'affichage
indique le **jour**, l'**heure de début** et l'**heure de fin** de chaque
créneau. Impossible pour deux personnes de réserver le même jour à la même
heure : une vérification serveur (`/api/appointments`) rejette toute
réservation en conflit avec un rendez-vous déjà `PENDING` ou `CONFIRMED`.

### Cloche de notification
Visible uniquement pour un utilisateur connecté (`src/components/NotificationBell.tsx`),
elle affiche un point rouge dès qu'il y a une actualité, un tirage ou (pour
les membres Premium) un nouveau sujet de forum plus récent que la dernière
consultation. Chaque élément de la liste est **cliquable** et renvoie
directement vers l'actualité, les tirages ou le sujet concerné.

### Suivi de procédure : PDF, progression, édition admin
- **Barre de progression** dans le tableau de bord et sur le suivi imprimé,
  calculée sur les 13 étapes.
- **Export PDF à tout moment** : `/dashboard/suivi/imprimer` présente un
  suivi propre (score CRS, étapes, dates) et déclenche l'impression du
  navigateur — la personne choisit "Enregistrer en PDF" dans la fenêtre
  d'impression (aucune librairie PDF ajoutée, `window.print()` + CSS `print:`).
- **Un administrateur peut corriger la date d'une étape** pour n'importe quel
  utilisateur depuis `/admin/utilisateurs/[id]` (`AdminChecklistEditor.tsx`,
  route `PATCH /api/admin/checklist/[id]`) — utile en support.

### Contact avec réponse admin
Depuis `/admin/messages`, un administrateur peut désormais **répondre
directement à un message** : la réponse est enregistrée
(`ContactMessage.adminReply` / `repliedAt`) et un email est envoyé à la
personne si `RESEND_API_KEY` est configurée.

### Inscription responsable
À la création de compte, la personne doit cocher une case reconnaissant que
Route 67 n'est pas un consultant en immigration agréé et qu'elle s'inscrit
uniquement pour s'informer (`User.acceptedDisclaimerAt`, requis côté serveur
— l'inscription est refusée sans cette case cochée).

### Actualités illustrées
Un administrateur peut joindre une image à chaque actualité depuis
`/admin/actualites` (téléversement, encodé en base64 et stocké directement
en base — aucun service de stockage externe branché dans ce MVP, taille
limitée à ~1,3 Mo ; voir la section 8 pour la piste d'amélioration).

### Simulateur CRS — grille officielle complète
`src/lib/crs.ts` reproduit la grille officielle du Système de classement global
d'IRCC (la même que l'outil Canadavisa) : capital humain avec/sans conjoint,
facteurs du conjoint, transférabilité des compétences (études, expérience
étrangère, certificat de compétence), points supplémentaires (fratrie, bonus
bilingue français, études canadiennes, candidature provinciale). Les points pour
offre d'emploi ont été retirés, conformément au changement IRCC du 25 mars 2025.

### Procédure Entrée express
`/procedure` présente la ligne du temps complète — **13 étapes**, du test de
langue à l'entrée effective au Canada — avec délai indicatif pour chacune, et
une bande déroulante (accordéon) vers 3 guides très détaillés :
`/procedure/test-de-langue`, `/procedure/equivalence-diplome`,
`/procedure/creation-compte`. Le suivi de dossier (`ChecklistItem`) reprend ces
mêmes 13 étapes et enregistre automatiquement la **date d'exécution** de
chaque étape cochée.

### Rendez-vous Premium
Chaque créneau affiche le **jour**, l'**heure de début** et l'**heure de fin**
(30 minutes par défaut). Impossible pour deux personnes de réserver le même
jour à la même heure : une vérification serveur (`/api/appointments`) rejette
toute réservation en conflit avec un rendez-vous déjà `PENDING` ou `CONFIRMED`.

### Cloche de notification
Visible uniquement pour un utilisateur connecté (`src/components/NotificationBell.tsx`),
elle affiche un point rouge dès qu'une actualité plus récente que la dernière
consultée a été publiée, avec un aperçu des dernières brèves au clic.

### Contact
`/contact` (accessible sans compte) : formulaire enregistré en base
(`ContactMessage`, visible dans `/admin/messages`) + tentative d'envoi email à
l'équipe + liens directs `mailto:`/WhatsApp.

### Rappels réglementaires
Le composant `src/components/Disclaimer.tsx` rappelle, partout où c'est
pertinent (simulateur, procédure, forum, dashboard, contact, footer, prompt
système de l'IA), que Route 67 n'est pas un cabinet ni un agent d'immigration
agréé — le projet vise seulement à rendre l'information plus accessible.

### Design
Refonte mobile-first inspirée des sites d'actualité (bandeau d'actualités
animé + carrousel "à la une" avec image et texte remonté juste sous le hero,

navigation sticky, cartes denses, accents rouge/vert/jaune du Cameroun). Voir
`src/app/page.tsx` et `src/components/NewsCarousel.tsx`.

### Espace administrateur (`/admin`, rôles `ADMIN` et `MODERATOR`)
Vue d'ensemble, utilisateurs & forfaits (confirmation des paiements Premium,
suppression de compte), messages de contact (avec réponse par email),
actualités (avec pré-rédaction IA relue par un humain, image jointe), forum
(validation des sujets proposés, suppression de messages), rendez-vous
(disponibilités + confirmation + lien de visio), tirages, sécurité (2FA).

Le rôle **Modérateur** a les mêmes privilèges que l'Administrateur pour la
gestion courante, à l'exception de :
- attribuer un rôle à un compte (réservé à l'ADMIN) ;
- **toute** action sur un compte Administrateur — un modérateur ne voit même
  plus les champs forfait/avertissement/suivi/suppression sur une ligne
  Administrateur (colonnes vides), pas seulement désactivés ;
- valider, refuser ou annuler un rendez-vous (il peut voir les demandes,
  pas les traiter) ;
- changer le mot de passe d'un autre compte (réservé à l'ADMIN, y compris
  pour réinitialiser celui d'un modérateur — bouton "Changer" dans
  `/admin/utilisateurs`).

Un **Administrateur ne peut pas non plus s'auto-supprimer, se retirer son
propre rôle ADMIN, ni se retirer son propre forfait Premium** — ces actions
doivent venir d'un autre administrateur (voir `/api/admin/users`).

La liste des utilisateurs (`/admin/utilisateurs`) classe les comptes
Administrateurs en tête, puis Modérateurs, puis Utilisateurs par ordre
alphabétique, et affiche la **date d'expiration exacte** de chaque forfait
Premium — les comptes Administrateur et Modérateur n'expirent jamais.

### Comptes : rôles, 2FA, vérification, mot de passe oublié
- **Double authentification (2FA/TOTP)** disponible sur `/admin/securite`
  pour tout compte (en pratique, réservée aux Administrateurs/Modérateurs) :
  QR code compatible Google Authenticator / Authy, via `otplib` + `qrcode`
  (aucun service externe). Une fois activée, la connexion demande un
  deuxième facteur (`/api/auth/verify-2fa`) après le mot de passe.
- **Vérification d'email** envoyée automatiquement à l'inscription
  (`/verifier-email?token=...`, valable 24h) — n'empêche pas l'utilisation
  du compte, c'est une confirmation en tâche de fond.
- **Mot de passe oublié** : `/mot-de-passe-oublie` → email avec lien à usage
  unique valable 1h (`/reinitialiser-mot-de-passe?token=...`) → nouveau mot
  de passe. Réponse volontairement identique que l'email existe ou non, pour
  ne pas permettre l'énumération de comptes.
- Ces deux flux utilisent `VerificationToken` (`src/lib/tokens.ts`) : jetons
  aléatoires à usage unique, invalidés dès consommation.

### Rendez-vous : calendrier réel, créneaux grisés, visioconférence
`/rendez-vous` propose un vrai sélecteur de date (`<input type="date">`) puis
la liste des créneaux de 30 minutes ce jour-là — les créneaux déjà pris
apparaissent **grisés et non cliquables** plutôt que de disparaître, pour que
la personne comprenne pourquoi une heure n'est plus disponible. Impossible de
réserver deux fois le même créneau (vérification serveur + désactivation
immédiate côté client), et **maximum 2 rendez-vous par semaine civile
(lundi→dimanche) par utilisateur**. À la confirmation (réservée à un ADMIN —
un modérateur peut voir les demandes mais pas les traiter), un administrateur
peut joindre un **lien de visioconférence** (Google Meet, WhatsApp, Zoom…)
communiqué manuellement — visible par la personne dès que son rendez-vous
passe à "Confirmé". Côté admin, `/admin/rendez-vous` affiche désormais un
**calendrier hebdomadaire visuel** (blocs positionnés par heure de début/fin)
plutôt qu'une simple liste, pour visualiser d'un coup d'œil les disponibilités
signalées aux utilisateurs.

### Simulateur CRS : signal d'admissibilité
En plus du score, le simulateur signale si le profil semble **sous les
seuils plancher courants** de l'Entrée express (aucun résultat linguistique
exploitable, ou aucune expérience de travail qualifiante) — un signal
indicatif, pas une évaluation légale complète (voir
`checkBasicEligibility()` dans `src/lib/crs.ts`).

### Chat direct utilisateur ↔ équipe (Premium)
Remplace l'ancien système de messages à sens unique. `/contact` (public,
sans compte requis) crée ou complète un fil de discussion
(`SupportThread` + `SupportMessage`) ; si la personne est connectée **et
Premium** (ou membre de l'équipe), ce fil est **le même** que celui
accessible en permanence depuis `/dashboard/chat` — un vrai chat persistant,
actualisé par sondage léger toutes les 3 secondes pour un effet quasi
instantané (pas de WebSocket). Quand l'équipe répond (`/admin/chat`), la
réponse part par email à la personne **et** reste visible dans son espace de
compte. Un utilisateur Gratuit peut toujours écrire via `/contact`, mais
n'a pas accès à l'interface de chat continue tant qu'il n'est pas Premium.
Les visiteurs non connectés obtiennent un fil "invité" ponctuel (email
uniquement, pas d'espace de compte pour continuer la conversation).

### FAQ
`/faq` (public) affiche les questions fréquentes en accordéon, gérées
depuis `/admin/faq` (`FaqItem`).

### Comptes avertis
Un compte marqué `warned` par l'équipe (voir `/admin/utilisateurs`) ne peut
plus **ni publier sur le forum, ni prendre de nouveau rendez-vous** —
vérifié côté serveur sur chaque route concernée, avec un message explicite
côté page plutôt qu'une erreur découverte seulement à l'envoi.

### Rendez-vous : dates précises, capacité multi-admin, annulation
Les disponibilités admin sont désormais rattachées à une **date précise**
(`AvailabilitySlot.date`), plus à un jour de semaine récurrent — le
calendrier de `/admin/rendez-vous` affiche chaque date à venir avec ses
plages ouvertes ET les rendez-vous déjà confirmés ce jour-là. Un
utilisateur ne peut pas dépasser **1 rendez-vous actif par semaine
civile** : au-delà, les créneaux de cette semaine sont grisés côté client
(pas seulement rejetés côté serveur), et se libèrent automatiquement si
l'équipe refuse ou annule son rendez-vous (seuls les statuts
`PENDING`/`CONFIRMED` comptent dans la limite). Si **plusieurs plages se
recoupent sur le même horaire** (plusieurs administrateurs disponibles en
même temps), la **capacité** de ce créneau augmente d'autant : deux
personnes différentes peuvent réserver la même heure exacte tant que le
nombre de réservations actives n'a pas atteint le nombre d'administrateurs
disponibles à ce moment (voir le calcul dans `/api/appointments` et
`/api/appointments/availability`). Un **refus admin retire automatiquement**
ce créneau exact des disponibilités pour tout le monde (`BlockedSlot`),
plutôt que de le laisser réapparaître. L'utilisateur peut désormais
**annuler lui-même** un rendez-vous en attente ou confirmé ; l'équipe (ADMIN
uniquement, pas les modérateurs) peut aussi confirmer, refuser ou annuler —
un refus ou une annulation ajoute automatiquement un **petit message
d'excuse** invitant à choisir un autre horaire si l'admin n'en a pas rédigé
un lui-même.

### Dons : Orange Money, MTN MoMo, PayPal
La section "Soutenir le projet" de la page d'accueil et le panneau du
tableau de bord ont été reformulés en **don anonyme** plutôt qu'en achat
d'un forfait : mêmes numéros Mobile Money + **PayPal** en plus
(`PAYPAL_LINK`), avec un vocabulaire "don" cohérent partout (emails inclus).
Le mécanisme technique reste le même (le don débloque le forfait Premium
pendant 1 mois).

### Campagnes d'emailing admin
`/admin/campagnes` permet à l'équipe (ADMIN ou MODERATOR) de rédiger un
message et de l'envoyer à tous les utilisateurs, ou seulement aux membres
Premium/Gratuit, pour annoncer un événement ponctuel. Le gabarit
`{{name}}` est remplacé par le prénom de chaque destinataire
(`personalizeTemplate()` dans `src/lib/mailer.ts`) — même mécanisme
d'envoi (Resend) que le reste du site, donc rien de nouveau à configurer.
Chaque campagne est historisée (`EmailCampaign`) avec le nombre d'envois
réussis/échoués. **Limite MVP** : 500 destinataires max par envoi direct
(pas de file d'attente ni de tâche de fond) — voir section 8 pour la piste
de montée en charge.

### Modération et fuseau horaire du visiteur
Un message de forum supprimé par l'équipe n'est pas effacé mais marqué
`deleted` : "Message supprimé" s'affiche à la place du contenu, sous le nom
de l'auteur, pour garder une trace de modération. Toutes les dates
affichées aux utilisateurs (actualités, tirages, forum, rendez-vous) sont
formatées **dans le fuseau horaire du navigateur du visiteur**, pas celui
du serveur — via un petit composant client dédié
(`src/components/LocalDateTime.tsx`) pour les rares dates encore rendues
côté serveur ; les autres sont déjà dans des composants client, qui
utilisent nativement le fuseau local du visiteur.

## 5. Paiement Mobile Money — état actuel et intégration réelle

Aucune passerelle de paiement n'est branchée : c'est un choix volontaire pour
livrer un flux complet et fonctionnel sans dépendre d'un compte marchand
externe. Flux actuel, humain et vérifié :

1. La personne clique sur "Devenir Premium" → une demande est créée et les
   numéros Orange Money / MTN MoMo (+ nom du titulaire) s'affichent à l'écran
   (+ email si `RESEND_API_KEY` est configurée).
2. Elle paie de son côté, puis confirme via le formulaire (référence de
   transaction), par email, ou par WhatsApp.
3. Un administrateur vérifie et confirme dans `/admin/utilisateurs` → le
   forfait est activé pour 30 jours. **En cas de renouvellement** alors que
   le forfait est encore actif, les 30 jours s'ajoutent à la date
   d'expiration existante plutôt que de repartir de zéro — aucun jour payé
   n'est perdu. Une notification (cloche) prévient l'utilisateur à partir de
   5 jours avant l'expiration, et chaque jour jusqu'à l'expiration.

Pour automatiser l'encaissement, intègre un agrégateur comme
[CinetPay](https://cinetpay.com), [Notch Pay](https://notchpay.co) ou
[Pawapay](https://pawapay.io) et remplace la logique de
`POST /api/subscription/upgrade` par leur API, avec un webhook de confirmation
automatique.

## 6. Email et Intelligence artificielle — ce qui est branché

- **Email** (`src/lib/mailer.ts`) : utilise l'API [Resend](https://resend.com)
  via `RESEND_API_KEY`. Sans clé, rien ne casse — le message reste enregistré
  en base et affiché à l'écran (upgrade Premium, contact).
- **Assistant IA candidat** (`/api/ai/assistant`) : réservé aux membres
  **Premium** (et à l'équipe) — widget masqué et API rejetée pour un compte
  Gratuit, quota 40 questions/jour.
- **Pré-rédaction d'actualités** (`/api/admin/news/ai-draft`) : jamais publiée
  automatiquement, toujours relue par un admin.

Les deux fonctionnalités IA nécessitent `ANTHROPIC_API_KEY` ; sans elle, elles
répondent avec une erreur claire (503) sans affecter le reste du site.

## 7. Design — palette Cameroun

Vert (`cmr-green` `#007A5E`), rouge (`cmr-red` `#CE1126`) et jaune
(`cmr-yellow` `#FCD116`) en accents (liseré, badges, boutons clés), jamais en
aplats massifs. Voir `tailwind.config.ts`.

La page d'accueil place désormais le bloc **Contact** avant le bloc
**Soutenir le projet**. Ce dernier affiche deux cartes côte à côte : à
gauche, "Don anonyme" — uniquement informatif (numéros Mobile Money +
PayPal), **sans aucun bouton cliquable**, pour respecter le caractère
anonyme du don ; à droite, "Avantages Premium" avec un bouton qui s'adapte
(`PremiumCtaButton.tsx`) — "Créer mon compte" si tu n'es pas connecté,
"Devenir Premium" qui te renvoie directement vers `/dashboard#don` si tu
l'es déjà. Ce même lien d'ancrage est utilisé partout où le site propose de
devenir Premium (forum, rendez-vous, chat, procédure).

Une fois connecté, la Navbar affiche ton **prénom** à la place du texte
générique "Mon compte" (`AccountLink.tsx`). La page de connexion n'affiche
plus les identifiants de démonstration en clair (ils restent documentés dans
ce README pour le développement).

## 8. Ce qui n'est PAS encore inclus (prochaines étapes)

- Paiement Mobile Money automatisé (voir section 5)
- Campagnes d'emailing en file d'attente (job en arrière-plan, ex. via un
  worker ou un service comme Resend Broadcasts) pour dépasser la limite de
  500 destinataires par envoi direct sans risquer un timeout serveur
- Alertes email/WhatsApp sur nouveau tirage pertinent ou échéance de dossier
- Alimentation automatique des tirages/actualités IRCC (scraping ou flux RSS)
- Stockage d'images sur un vrai service (S3, Cloudinary...) plutôt qu'en
  base64 en base de données — suffisant pour un MVP, à changer avant un
  volume important d'actualités illustrées
- Verrou base de données (contrainte unique/transaction) sur la réservation
  de rendez-vous pour éliminer la (très faible) fenêtre de concurrence entre
  la vérification et la création ; le contrôle applicatif actuel suffit à
  l'usage prévu mais n'est pas garanti à 100 % sous forte charge simultanée
- 2FA obligatoire (actuellement optionnelle et activable par la personne
  elle-même) pour tous les comptes Administrateur/Modérateur
- Évaluation d'admissibilité complète (grille des 67 points du PTQF,
  exigences précises par TEER) — le signal actuel ne couvre que quelques
  critères plancher évidents, voir section 4
- Chat en temps réel (WebSocket) : le chat actuel s'actualise par nouvel
  appel API à chaque envoi/ouverture, pas par un flux push — suffisant pour
  une discussion asynchrone, pas pour un vrai "live chat"
- Intégration réelle du bouton PayPal (actuellement un lien affiché à
  copier/suivre manuellement, pas un bouton de paiement PayPal intégré)

## 9. Sécurité

- Mots de passe hachés bcrypt (coût 12), jamais stockés en clair
- Sessions JWT signées, cookie `httpOnly` + `secure` (prod) + `sameSite=lax`
- Toutes les entrées validées avec Zod
- Middleware + revérification systématique du rôle/forfait en base dans
  chaque route sensible (`src/lib/session.ts`) — jamais uniquement via le
  JWT ou le middleware
- Forum et rendez-vous revérifiés **Premium** à la fois côté page et côté API
  (défense en profondeur)
- Limiteur de tentatives (connexion, contact, assistant IA, 2FA, mot de passe
  oublié) — voir `src/lib/rateLimit.ts`, en mémoire (insuffisant en serverless
  multi-instances ; prévoir Upstash Redis avant un vrai lancement)
- Double authentification (TOTP) disponible pour sécuriser les comptes
  Administrateur/Modérateur — jeton de connexion temporaire (5 min) distinct
  du vrai cookie de session tant que le second facteur n'est pas validé
- Jetons de vérification d'email / réinitialisation de mot de passe à usage
  unique, expirants (24h / 1h), stockés hachés en base via un modèle dédié
  (`VerificationToken`) plutôt qu'en clair dans l'URL de façon permanente
- Frontière de rôle Modérateur/Administrateur appliquée côté serveur (jamais
  côté client) : un Modérateur ne peut ni attribuer de rôle, ni supprimer un
  compte Administrateur, quoi qu'affiche l'interface

## 10. Avant un vrai lancement public — recommandations

- Audit de sécurité avant de traiter des données sensibles (statut
  d'immigration) et des paiements réels
- Cadre légal de l'offre payante, du forum et de l'assistant IA à faire
  valider par un juriste (consultation individualisée en immigration
  réglementée au Canada — CRCIC)
- Modération du forum (signalement de message abusif)
- Sauvegardes de base de données automatiques et testées
- Conformité protection des données (CEMAC/Cameroun, RGPD si utilisateurs
  européens) — statut d'immigration et échanges du forum sont des données
  sensibles
- Monitoring et logs d'erreurs (ex. Sentry)

## 11. Déploiement

- Frontend + API : [Vercel](https://vercel.com)
- Base de données : [Neon](https://neon.tech) ou [Supabase](https://supabase.com)

Renseigne les mêmes variables d'environnement que dans `.env` (dont
`ANTHROPIC_API_KEY` et `RESEND_API_KEY` si tu veux l'IA et l'email en
production), puis exécute `npx prisma migrate deploy` avant le premier
déploiement.
#   R o u t e 6 7 
 
 #   R o u t e 6 7 
 
 #   R o u t e 6 7 
 
 #   R o u t e 6 7 
 
 #   R o u t e 6 7 - a p p 
 
 #   R o u t e 6 7 - a p p 
 
 

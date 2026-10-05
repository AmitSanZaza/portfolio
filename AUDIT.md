# Audit du portfolio — octobre 2026

Périmètre : code de l'application (Next.js 16 + Supabase), SQL Supabase, dépendances, SEO, accessibilité et UX.
État de départ : lint et tests OK (10 tests), mais **1 vulnérabilité critique** et plusieurs failles de sécurité.

Légende : ✅ corrigé dans cette mise à jour · ⚠️ action manuelle requise · 💡 recommandation (non faite)

## 1. Sécurité

| Gravité      | Problème                                                                                                                                                                                                                                                                                    | Statut                                                                                                                                                                                        |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Critique** | `next@16.3.4` vulnérable à une exécution de code à distance (GHSA-vcvr-r3jv-pc5j).                                                                                                                                                                                                          | ✅ Mise à jour vers `next@16.3.8` (+ React 19.3, Supabase, Zod…). `npm audit --omit=dev` : 0 vulnérabilité.                                                                                   |
| **Critique** | Les règles RLS autorisaient l'écriture à **n'importe quel utilisateur connecté**. Or Supabase autorise par défaut l'inscription publique avec la clé `anon` (visible dans le navigateur) : n'importe qui pouvait créer un compte et modifier/supprimer les projets et images. Viole SC-005. | ✅ Nouvelle table `site_owners` + fonction `is_site_owner()` ; écriture limitée au propriétaire (projets **et** stockage). La connexion admin refuse aussi les non-propriétaires. ⚠️ Voir §6. |
| Élevée       | Les URLs de projet acceptaient `javascript:` / `data:` (Zod `z.url()` les laisse passer) → XSS stocké via les liens des cartes.                                                                                                                                                             | ✅ Seuls `http`/`https` sont acceptés (+ tests).                                                                                                                                              |
| Moyenne      | Upload d'image sans contrôle serveur du type ni de la taille ; nom de fichier client réutilisé tel quel dans le chemin de stockage (SVG/HTML possibles).                                                                                                                                    | ✅ Types autorisés : PNG/JPEG/WebP/GIF/AVIF, 4 Mo max (côté serveur **et** au niveau du bucket) ; nom de fichier généré (UUID + extension).                                                   |
| Moyenne      | Pas de `proxy.ts` (ex-middleware) : la session Supabase n'était jamais rafraîchie (les Server Components ne peuvent pas écrire de cookies) → déconnexions silencieuses.                                                                                                                     | ✅ `proxy.ts` ajouté selon le guide Supabase SSR.                                                                                                                                             |
| Faible       | Aucun en-tête de sécurité HTTP.                                                                                                                                                                                                                                                             | ✅ `X-Content-Type-Options`, `Referrer-Policy`, anti-clickjacking (`X-Frame-Options` + `frame-ancestors`), `Permissions-Policy`.                                                              |
| Faible       | 5 vulnérabilités « high » dans `braces`/`micromatch` via `eslint-config-next`.                                                                                                                                                                                                              | 💡 Outils de dev uniquement (non déployés) et aucun correctif publié en amont ; `npm audit fix --force` rétrograderait vers Next 14. À surveiller.                                            |
| Info         | Le lien « Admin login » était dans la navigation principale.                                                                                                                                                                                                                                | ✅ Déplacé discrètement dans le pied de page.                                                                                                                                                 |

## 2. Fiabilité / bugs

| Problème                                                                                                                                      | Statut                                                                                      |
| --------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| Les images remplacées ou supprimées restaient indéfiniment dans le stockage (fichiers orphelins), de même qu'en cas d'échec d'enregistrement. | ✅ Nettoyage (best-effort) à la mise à jour, à la suppression et en cas d'échec.            |
| `deleteProject` ignorait les erreurs de la base.                                                                                              | ✅ L'erreur remonte et s'affiche.                                                           |
| Limite de 1 Mo par défaut des Server Actions : la plupart des captures d'écran étaient rejetées avec une erreur incompréhensible.             | ✅ `bodySizeLimit` porté à 5 Mo.                                                            |
| Pas de page d'erreur ni de 404 personnalisées.                                                                                                | ✅ `app/error.tsx` et `app/not-found.tsx`.                                                  |
| Si Supabase est indisponible (projet gratuit mis en pause après 7 jours d'inactivité), la page d'accueil plantait entièrement.                | ✅ L'intro reste visible, seule la section projets affiche « temporairement indisponible ». |
| Tags de technologies en double → doublons affichés et clés React en conflit.                                                                  | ✅ Dédoublonnage à la validation.                                                           |
| Modifier un projet supprimé entre-temps « réussissait » silencieusement.                                                                      | ✅ Message d'erreur explicite.                                                              |

## 3. SEO

| Problème                                                                | Statut                                                                                               |
| ----------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| Titre générique « Portfolio » identique sur toutes les pages.           | ✅ « Amit Barua — Portfolio » + titres par page (« About \| Amit Barua »…).                          |
| Pas de description pertinente, pas d'Open Graph, pas de `metadataBase`. | ✅ Description = tagline ; Open Graph ; URL de base via `NEXT_PUBLIC_SITE_URL` (ou URL Vercel auto). |
| Pas de `robots.txt` ni de `sitemap.xml` ; l'admin était indexable.      | ✅ `robots.ts`, `sitemap.ts`, et `noindex` sur tout `/admin`.                                        |
| 💡 Pas d'image Open Graph (aperçu lors du partage sur LinkedIn, etc.).  | À ajouter : un fichier `app/opengraph-image.png` (1200×630) suffit.                                  |

## 4. Accessibilité & UX

| Problème                                                                                                 | Statut                                                                       |
| -------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| La police Geist était chargée mais jamais utilisée (`font-family: Arial` dans `globals.css` l'écrasait). | ✅ Corrigé.                                                                  |
| Page d'accueil sans `<h1>` ni présentation : un visiteur ne savait pas à qui appartenait le portfolio.   | ✅ Section d'intro (nom, accroche, boutons « Get in touch » / « About me »). |
| Pas de lien d'évitement (« skip to content ») pour la navigation clavier.                                | ✅ Ajouté.                                                                   |
| Aucun indicateur de page active dans le menu.                                                            | ✅ Style actif + `aria-current="page"`.                                      |
| Pas de pied de page ni de lien vers GitHub.                                                              | ✅ Pied de page (e-mail, GitHub) et liens de profil sur la page Contact.     |
| Images des cartes chargées immédiatement.                                                                | ✅ `loading="lazy"`.                                                         |
| Formulaire : aucun indice sur les formats/tailles d'image acceptés.                                      | ✅ Indication ajoutée.                                                       |

## 5. Qualité du code & outillage

- ✅ Avertissement Vitest corrigé (`vitest.config.ts` → `.mts`, `import.meta.dirname`).
- ✅ Tests : 10 → 19 (schémas d'URL, dédoublonnage, validation d'image, accueil en mode dégradé).
- ✅ Vérifié : `npm run lint`, `tsc --noEmit`, `npm test`, `npm run build`, et rendu réel des pages (bureau + mobile).
- 💡 Ajouter une CI GitHub Actions (lint + tests + build) sur chaque push.
- 💡 Toutes les pages sont dynamiques (la barre de navigation lit la session) ; acceptable pour ce trafic, mais l'accueil pourrait être mis en cache si le site grossit.

## 6. ⚠️ Actions à faire de ton côté (obligatoires)

1. **Supabase → SQL Editor** : réexécuter `supabase/schema.sql`, puis `supabase/storage.sql` (les deux sont ré-exécutables sans risque).
2. Te déclarer propriétaire :
   ```sql
   insert into public.site_owners (user_id)
   select id from auth.users where email = 'TON_EMAIL_DE_CONNEXION_ADMIN';
   ```
   Sans cette étape, l'admin refusera ta connexion.
3. **Authentication → Sign In / Providers** : désactiver « Allow new users to sign up ».
4. **Authentication → Users** : vérifier qu'aucun compte inconnu n'a été créé, et que tes projets n'ont pas été modifiés.
5. (Optionnel) **Vercel** : ajouter `NEXT_PUBLIC_SITE_URL` si tu as un nom de domaine.

## 7. Contenu à compléter (suggestions)

- Ajouter ton **LinkedIn** dans `links` de `lib/profile-content.ts` (seul GitHub y figure).
- Étoffer la bio (formation, école, ce que tu cherches : stage/alternance ?) et regrouper les compétences par catégorie.
- Vérifier l'adresse de contact : le site affiche `amit15barua@gmail.com`.
- Ajouter un CV téléchargeable (PDF dans `public/`).

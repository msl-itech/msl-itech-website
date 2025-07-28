# 📋 PROCÉDURE D'EXPORT DES DONNÉES PERSONNELLES - RGPD

**MSL-iTECH - Politique de confidentialité**

---

## 🎯 **RÉSUMÉ EXÉCUTIF**

Cette procédure détaille comment MSL-iTECH peut permettre aux utilisateurs d'exporter leurs données personnelles, conformément aux articles 15 (droit d'accès) et 20 (portabilité) du RGPD.

**🚨 STATUT ACTUEL :** Fonctionnalité développée mais temporairement désactivée en attente de validation.

---

## 📊 **DEUX TYPES D'EXPORT PROPOSÉS**

### 1. 📱 **EXPORT IMMÉDIAT (Données locales)**

**Délai :** Instantané  
**Contenu :**

- Préférences de cookies (Analytics, Fonctionnel, Essentiel)
- Date et historique de consentement RGPD
- Cookies stockés dans le navigateur
- Données de session locale
- Métadonnées (navigateur, langue, date d'export)

**Format :** Fichier JSON téléchargeable immédiatement

**Avantages :**

- ✅ Satisfaction immédiate du client
- ✅ Aucune intervention manuelle requise
- ✅ Conforme RGPD pour les données locales

---

### 2. 📧 **EXPORT COMPLET (Toutes nos données)**

**Délai :** 30 jours maximum (conforme RGPD)  
**Contenu :**

- **Données CRM/Odoo :** Contacts, leads, historique commercial
- **Projets :** Devis, contrats, historique des échanges
- **Communications :** Emails envoyés/reçus, appels téléphoniques
- **Analytics :** Statistiques de navigation (si stockées)
- **Données locales :** Incluses également
- **Toute autre donnée** présente dans nos systèmes

**Processus :**

1. Client saisit son email via interface web
2. Demande automatiquement créée dans Odoo CRM
3. **Traitement manuel par l'équipe MSL-iTECH**
4. Envoi sécurisé par email sous 30 jours

---

## 🔧 **IMPLÉMENTATION TECHNIQUE**

### **Architecture développée :**

```
Frontend (Site web)
    ↓
ConsentService (Angular)
    ↓
API Odoo existante (api-connect-odoo.vercel.app)
    ↓
CRM Odoo (Gestion des demandes)
```

### **Intégration avec l'existant :**

- ✅ **Utilise l'API Odoo existante** (aucune nouvelle infrastructure)
- ✅ **Réutilise les headers de sécurité** (x-signature, x-client-id)
- ✅ **Interface intégrée** dans la politique de confidentialité

---

## 📋 **PROCESSUS OPÉRATIONNEL**

### **Pour l'export immédiat :**

Aucune intervention requise - Automatique

### **Pour l'export complet :**

#### **1. Réception de la demande**

- Lead automatiquement créé dans Odoo avec :
  - Nom : "Demande Export RGPD"
  - Email du demandeur
  - Description détaillée avec date et type de demande
  - Sujet : "RGPD - Demande export données personnelles"

#### **2. Traitement (Équipe MSL-iTECH)**

- **Identifier la personne** dans tous les systèmes :
  - CRM Odoo (contacts, leads, projets)
  - Base emails (newsletters, communications)
  - Analytics (si données identifiantes stockées)
  - Historique commercial
  - Documents signés/échangés

#### **3. Compilation des données**

- **Extraire toutes les données** liées à la personne
- **Anonymiser les données tiers** (autres clients mentionnés)
- **Formatter en document lisible** (PDF + annexes JSON)

#### **4. Envoi sécurisé**

- Email chiffré avec fichier protégé par mot de passe
- Confirmation de réception demandée
- **Délai maximum : 30 jours** (Article 12 RGPD)

---

## ⚖️ **CONFORMITÉ LÉGALE**

### **RGPD - Articles concernés :**

- **Article 12 :** Délai de réponse (30 jours)
- **Article 15 :** Droit d'accès aux données
- **Article 20 :** Droit à la portabilité
- **Article 25 :** Protection des données dès la conception

### **Loi marocaine 09-08 :**

- Respect des droits de la personne concernée
- Procédure transparente et accessible

---

## 💰 **IMPACTS BUSINESS**

### **Avantages :**

- ✅ **Conformité RGPD totale** - Évite les amendes (jusqu'à 4% CA)
- ✅ **Transparence client** - Renforce la confiance
- ✅ **Différenciation concurrentielle** - Peu d'entreprises offrent cela
- ✅ **Process automatisé** - Minimal impact opérationnel

### **Coûts :**

- ⏱️ **Temps de traitement** : ~2-3h par demande d'export complet
- 👥 **Ressources** : 1 personne formée au process
- 📊 **Fréquence estimée** : 1-2 demandes/mois maximum

---

## 🚀 **RECOMMANDATIONS**

### **Option 1 : Activation complète**

- Activer les deux types d'export
- Former 1-2 personnes au processus d'export complet
- Communication marketing sur la transparence RGPD

### **Option 2 : Activation progressive**

- Commencer par l'export immédiat uniquement
- Ajouter l'export complet après formation équipe

### **Option 3 : Export manuel uniquement**

- Désactiver les boutons automatiques
- Traiter les demandes par email traditionnel (info@msl-itech.com)

---

## 📞 **PROCHAINES ÉTAPES**

1. **Validation de la stratégie** par la direction
2. **Formation de l'équipe** au processus d'export
3. **Tests en interne** avant activation
4. **Activation** sur le site de production
5. **Communication** aux clients existants

---

## 🔐 **SÉCURITÉ & CONFIDENTIALITÉ**

- **Données chiffrées** en transit et au repos
- **Accès restreint** aux données personnelles
- **Logs d'audit** pour toutes les demandes
- **Suppression sécurisée** des fichiers temporaires
- **Conformité** aux standards de sécurité existants

---

**Document préparé pour :** Direction MSL-iTECH  
**Date :** 27 janvier 2025  
**Status :** Développement terminé - En attente de validation  
**Contact technique :** Équipe développement MSL-iTECH

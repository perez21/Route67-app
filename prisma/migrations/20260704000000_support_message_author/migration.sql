-- Ajoute la trace du compte staff (admin/modérateur) qui a rédigé chaque
-- réponse envoyée dans le chat direct. Le visiteur continue de voir
-- seulement "Équipe Route 67" côté affichage ; ce champ sert uniquement à
-- l'équipe, dans /admin/chat, pour savoir qui a répondu.
ALTER TABLE "SupportMessage" ADD COLUMN "authorId" TEXT;

ALTER TABLE "SupportMessage" ADD CONSTRAINT "SupportMessage_authorId_fkey"
  FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

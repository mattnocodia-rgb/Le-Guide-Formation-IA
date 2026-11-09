import { Link, createFileRoute } from "@tanstack/react-router";

import { PageFrame } from "@/components/site/SiteChrome";
import { getSaleTerms } from "@/lib/content.functions";
import { SITE_NAME, SKILL_NAME, pageHead } from "@/lib/site";

const CONTACT = "contact@optimatt.fr";

export const Route = createFileRoute("/conditions-de-vente")({
  loader: () => getSaleTerms(),
  head: () => {
    const head = pageHead({
      title: `Conditions générales de vente — ${SITE_NAME}`,
      description:
        "Conditions de vente de la boutique : skills et tutos à télécharger, audit de site web, accompagnements sur devis. Prix, paiement, livraison, rétractation, garanties.",
      path: "/conditions-de-vente",
    });
    return { ...head, meta: [...head.meta, { name: "robots", content: "noindex, follow" }] };
  },
  component: Terms,
});

function Terms() {
  const { address, mediator, mediatorUrl, updated } = Route.useLoaderData();
  return (
    <PageFrame>
      <article className="container-wide max-w-[780px] py-12 md:py-16">
        <h1 className="mb-3 text-[clamp(34px,4.6vw,48px)] leading-[1.05]">
          Conditions générales de vente
        </h1>
        <p className="m-0 mb-8 text-ink-soft">En vigueur au {updated}.</p>
        <div className="prose-article prose-compact">
          <h2 id="vendeur">1. Vendeur</h2>
          <p>
            M. Matthieu Audineau, entrepreneur individuel (micro-entreprise)
            <br />
            SIRET : 852 848 415 00034
            <br />
            Adresse : {address}
            <br />
            Contact : <a href={`mailto:${CONTACT}`}>{CONTACT}</a>
          </p>

          <h2 id="objet">2. Objet et offres concernées</h2>
          <p>
            Les présentes conditions s'appliquent aux ventes de la{" "}
            <Link to="/boutique">boutique</Link>. Elles distinguent trois types d'offres :
          </p>
          <ul>
            <li>
              <strong>Les contenus numériques à télécharger</strong> : le skill «{" "}
              <Link to="/skill-seo-aeo-geo">{SKILL_NAME}</Link> » et le tuto «{" "}
              <Link to="/tuto-shorts">
                Créer des shorts automatiquement pour les réseaux sociaux
              </Link>{" "}
              ». Chacun est un fichier contenant des instructions à installer dans Claude ou un
              outil compatible, accompagné d'un guide d'utilisation. Ce sont des contenus numériques
              fournis sans support matériel, sans accompagnement ni prestation personnalisée
              (articles 6 à 9).
            </li>
            <li>
              <strong>
                L'<Link to="/audit-seo">audit de site web</Link>
              </strong>{" "}
              : une prestation de service comprenant un rapport écrit au format PDF et une visio de
              restitution de 45 minutes (articles 10 à 13).
            </li>
            <li>
              <strong>Les accompagnements</strong> (automatisation, site web) : des prestations sur
              mesure, réalisées sur devis (article 14).
            </li>
          </ul>
          <p>
            Les contenus numériques et l'audit fonctionnent avec des services tiers (Claude, édité
            par Anthropic, Google Search Console ou d'autres outils) dont l'accès, l'abonnement
            éventuel et l'évolution ne dépendent pas du vendeur. La compatibilité décrite sur la
            page de chaque offre est celle constatée à la date indiquée.
          </p>

          <h2 id="prix">3. Prix</h2>
          <p>
            Le prix est celui affiché sur la page de l'offre au moment de la commande, en euros, ou
            celui indiqué sur le devis pour les accompagnements.{" "}
            <strong>TVA non applicable, article 293 B du Code général des impôts.</strong>
          </p>

          <h2 id="commande">4. Commande et paiement</h2>
          <p>
            Les contenus numériques et l'audit se commandent sur la page de paiement sécurisée de
            Stripe. La commande est ferme une fois les présentes conditions acceptées et le paiement
            validé. Le paiement est exigible immédiatement. Le vendeur n'a jamais accès aux données
            de carte bancaire. Stripe envoie un reçu par e-mail, qui vaut confirmation de la
            commande.
          </p>

          <h2 id="garantie-resultat">5. Absence de garantie de résultat</h2>
          <p>
            Les offres de la boutique aident à améliorer un site, à rédiger du contenu ou à produire
            des vidéos. Elles ne garantissent aucun résultat de positionnement dans les moteurs de
            recherche, aucune citation par une intelligence artificielle, ni aucun niveau
            d'audience. Les contenus produits et les corrections appliquées restent sous la
            responsabilité du client, qui les relit avant publication.
          </p>

          <h2 id="numerique-livraison">6. Contenus numériques : livraison</h2>
          <p>
            Dès la confirmation du paiement, l'acheteur est redirigé vers une page de
            téléchargement. Le fichier est disponible immédiatement. L'adresse de cette page permet
            de le retélécharger. En cas de difficulté, le vendeur envoie le fichier par e-mail sur
            simple demande accompagnée du reçu.
          </p>

          <h2 id="retractation">7. Contenus numériques : droit de rétractation</h2>
          <p>
            Conformément à l'article L221-28, 13° du Code de la consommation, le droit de
            rétractation ne peut pas être exercé pour un contenu numérique fourni sans support
            matériel dont l'exécution a commencé avec l'accord préalable et exprès du consommateur,
            et pour lequel il a renoncé à son droit de rétractation.
          </p>
          <p>
            <strong>
              En cochant la case prévue lors du paiement, l'acheteur demande l'accès immédiat au
              fichier et renonce expressément à son droit de rétractation.
            </strong>{" "}
            La confirmation de cet accord figure sur le reçu envoyé par e-mail.
          </p>

          <h2 id="licence">8. Contenus numériques : licence d'utilisation</h2>
          <p>
            L'achat donne droit à une licence personnelle, non exclusive et sans limite de durée :
            l'acheteur peut utiliser le contenu autant qu'il le souhaite, pour ses propres projets
            ou ceux de ses clients, et l'adapter à son usage. Il est interdit de revendre, de
            distribuer, de partager publiquement ou de mettre à disposition le fichier ou son
            contenu, en tout ou en partie, gratuitement ou non. Le vendeur reste titulaire des
            droits d'auteur.
          </p>

          <h2 id="conformite">9. Contenus numériques : garantie de conformité</h2>
          <p>
            L'acheteur consommateur bénéficie de la garantie légale de conformité des contenus
            numériques (articles L224-25-1 et suivants du Code de la consommation). En cas de défaut
            de conformité, par exemple un fichier impossible à importer, il contacte le vendeur, qui
            fournit un fichier conforme ou, à défaut, rembourse.
          </p>

          <h2 id="audit-deroulement">10. Audit : déroulement et délais</h2>
          <p>
            Après le paiement, le client transmet l'adresse du site à auditer et, s'il le souhaite,
            un accès en lecture à sa Google Search Console. L'audit porte sur un seul site.
          </p>
          <p>
            <strong>
              Le rapport est envoyé par e-mail sous 7 jours ouvrés à compter de la réception de
              l'adresse du site.
            </strong>{" "}
            La visio de restitution de 45 minutes a lieu dans les 15 jours suivant l'envoi du
            rapport, à une date convenue ensemble par e-mail. Si le client ne fixe pas de date dans
            ce délai, le rapport reste acquis et la visio peut être reportée sur simple demande dans
            les 3 mois.
          </p>

          <h2 id="audit-retractation">11. Audit : droit de rétractation</h2>
          <p>
            Le client consommateur dispose d'un délai de 14 jours à compter du paiement pour se
            rétracter, sans avoir à se justifier, en écrivant à{" "}
            <a href={`mailto:${CONTACT}`}>{CONTACT}</a>. Il est alors remboursé sous 14 jours, par
            le même moyen de paiement.
          </p>
          <p>
            <strong>
              En cochant la case prévue lors du paiement, le client demande que l'audit commence
              avant la fin de ce délai.
            </strong>{" "}
            S'il se rétracte ensuite, il paie la part du travail déjà réalisée, proportionnelle au
            prix (article L221-25 du Code de la consommation). Une fois le rapport livré et la visio
            réalisée avec son accord exprès, la prestation est entièrement exécutée et le droit de
            rétractation ne peut plus être exercé (article L221-28, 1°).
          </p>

          <h2 id="audit-obligations">12. Audit : engagements de chacun</h2>
          <p>
            Le vendeur mène l'audit avec soin, selon les règles de l'art connues à la date de
            l'audit (obligation de moyens). Le client fournit une adresse de site accessible et des
            informations exactes. Le vendeur ne modifie jamais le site : il en lit les pages
            publiques et, le cas échéant, les données de la Search Console en lecture seule. Le
            client peut retirer cet accès à tout moment.
          </p>

          <h2 id="audit-rapport">13. Audit : utilisation du rapport</h2>
          <p>
            Le client peut utiliser librement le rapport pour son site, le partager avec son équipe
            ou ses prestataires et l'appliquer. Il ne peut pas le revendre ni le publier comme son
            propre travail.
          </p>

          <h2 id="accompagnements">14. Accompagnements sur devis</h2>
          <p>
            Les accompagnements (automatisation, site web) ne s'achètent pas en ligne. Ils démarrent
            par une demande sur la page <Link to="/contact">contact</Link>, puis un devis écrit qui
            précise le contenu de la prestation, le prix, le calendrier et les modalités de
            paiement. Le devis signé prévaut sur les présentes conditions pour tout ce qu'il règle.
          </p>

          <h2 id="donnees">15. Données personnelles</h2>
          <p>
            Le paiement est traité par Stripe, qui collecte les données nécessaires (nom, e-mail,
            moyen de paiement). Le vendeur reçoit le nom, l'e-mail et le montant de la commande, et
            les conserve pour la facturation et le support, pendant la durée légale de conservation
            des pièces comptables. Pour l'audit, l'adresse du site et les données de la Search
            Console ne servent qu'à réaliser la prestation. Le client peut exercer ses droits
            d'accès, de rectification et d'effacement en écrivant à{" "}
            <a href={`mailto:${CONTACT}`}>{CONTACT}</a>.
          </p>

          <h2 id="litiges">16. Réclamations et litiges</h2>
          <p>
            Toute réclamation s'adresse d'abord à <a href={`mailto:${CONTACT}`}>{CONTACT}</a>.
            {mediator ? (
              <>
                {" "}
                À défaut d'accord, le consommateur peut recourir gratuitement au médiateur de la
                consommation : {mediatorUrl ? <a href={mediatorUrl}>{mediator}</a> : mediator}.
              </>
            ) : null}{" "}
            Les présentes conditions sont soumises au droit français.
          </p>
        </div>
      </article>
    </PageFrame>
  );
}

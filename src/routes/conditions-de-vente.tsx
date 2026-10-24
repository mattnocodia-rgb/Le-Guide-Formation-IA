import { Link, createFileRoute } from "@tanstack/react-router";

import { PageFrame } from "@/components/site/SiteChrome";
import { getSaleTerms } from "@/lib/content.functions";
import { SITE_NAME, pageHead } from "@/lib/site";

const CONTACT = "contact@optimatt.fr";

export const Route = createFileRoute("/conditions-de-vente")({
  loader: () => getSaleTerms(),
  head: () => {
    const head = pageHead({
      title: `Conditions générales de vente — ${SITE_NAME}`,
      description:
        "Conditions de vente du skill Claude SEO / AEO / GEO : vendeur, prix, paiement, livraison, droit de rétractation, licence et garanties.",
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

          <h2 id="objet">2. Objet</h2>
          <p>
            Les présentes conditions s'appliquent à la vente en ligne du{" "}
            <Link to="/skill-seo-aeo-geo">skill Claude SEO / AEO / GEO</Link> (ci-après « le skill
            ») : un fichier .zip contenant des instructions et des grilles de contrôle à installer
            dans Claude ou un outil compatible, accompagné d'un guide d'utilisation au format PDF.
            Le skill est un contenu numérique fourni sans support matériel. Il ne comprend ni
            accompagnement ni prestation personnalisée.
          </p>
          <p>
            Le skill fonctionne avec des services tiers (Claude, édité par Anthropic, ou d'autres
            outils compatibles) dont l'accès, l'abonnement éventuel et l'évolution ne dépendent pas
            du vendeur. La compatibilité décrite sur la page du skill est celle constatée à la date
            indiquée.
          </p>

          <h2 id="prix">3. Prix</h2>
          <p>
            Le prix est celui affiché sur la page du skill au moment de la commande, en euros.{" "}
            <strong>TVA non applicable, article 293 B du Code général des impôts.</strong>
          </p>

          <h2 id="commande">4. Commande et paiement</h2>
          <p>
            La commande se passe sur la page de paiement sécurisée de Stripe. Elle est ferme une
            fois les présentes conditions acceptées et le paiement validé. Le paiement est exigible
            immédiatement. Le vendeur n'a jamais accès aux données de carte bancaire. Stripe envoie
            un reçu par e-mail, qui vaut confirmation de la commande.
          </p>

          <h2 id="livraison">5. Livraison</h2>
          <p>
            Dès la confirmation du paiement, l'acheteur est redirigé vers une page de
            téléchargement. Le fichier est disponible immédiatement. L'adresse de cette page permet
            de le retélécharger. En cas de difficulté, le vendeur envoie le fichier par e-mail sur
            simple demande accompagnée du reçu.
          </p>

          <h2 id="retractation">6. Droit de rétractation</h2>
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

          <h2 id="licence">7. Licence d'utilisation</h2>
          <p>
            L'achat donne droit à une licence personnelle, non exclusive et sans limite de durée :
            l'acheteur peut utiliser le skill autant qu'il le souhaite, pour ses propres sites ou
            ceux de ses clients, et l'adapter à son usage. Il est interdit de revendre, de
            distribuer, de partager publiquement ou de mettre à disposition le fichier ou son
            contenu, en tout ou en partie, gratuitement ou non. Le vendeur reste titulaire des
            droits d'auteur sur le skill.
          </p>

          <h2 id="garanties">8. Garanties et responsabilité</h2>
          <p>
            L'acheteur consommateur bénéficie de la garantie légale de conformité des contenus
            numériques (articles L224-25-1 et suivants du Code de la consommation). En cas de défaut
            de conformité, par exemple un fichier impossible à importer, il contacte le vendeur, qui
            fournit un fichier conforme ou, à défaut, rembourse.
          </p>
          <p>
            Le skill aide à auditer et à rédiger du contenu. Il ne garantit aucun résultat de
            positionnement dans les moteurs de recherche, ni aucune citation par une intelligence
            artificielle. Les contenus produits avec lui restent sous la responsabilité de
            l'utilisateur, qui les relit avant publication.
          </p>

          <h2 id="donnees">9. Données personnelles</h2>
          <p>
            Le paiement est traité par Stripe, qui collecte les données nécessaires (nom, e-mail,
            moyen de paiement). Le vendeur reçoit le nom, l'e-mail et le montant de la commande, et
            les conserve pour la facturation et le support, pendant la durée légale de conservation
            des pièces comptables. L'acheteur peut exercer ses droits d'accès, de rectification et
            d'effacement en écrivant à <a href={`mailto:${CONTACT}`}>{CONTACT}</a>.
          </p>

          <h2 id="litiges">10. Réclamations et litiges</h2>
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

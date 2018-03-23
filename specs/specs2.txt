Problème du prix et de la quantité

s.eval('#_prix : 5, "prix"')
-> Créé une constante _prix qui est égale à 5
s.eval('#_somme: 20, "somme"')
-> Créé une constante _somme qui est égale à 20
s.eval('#_qte: ?, "quantité")
-> Créé une constante _qte dont la valeur est inconnue.

s.eval('_somme = _prix * _qte')
-> Définit une relation entre le prix, la quantité et la somme.

Énoncé du problème : 
Un marchand vend des pommes à {_prix}€ le Kg.
Un client possède {_somme}€.

Question à résoudre (en version texte)
Combien de Kg de pommes le client peut-il acheter ?

s.eval('objective : _qte')
-> Définit un objectif : ici trouver la valeur de l'inconnue _qte


Raisonnement : 
Le raisonnement est écrit par l'élève à l'aide de briques de raisonnement préconstruites.
Chaque définition ou déclaration de l'élève entraine une vérification.
Chaque déclaration doit découler directement d'une ou plusieurs déclaration précédentes (ou de l'énoncé).


"Soit p = 5 le prix au kilo"
s.eval('p -> _prix')
-> définit une variable p qui aliase _prix
s.eval('? p = 5')
-> Sachant que p = _prix, est-il vrai que p = 5
(Réponse oui car _prix = 5)

"Soit s = 20 la somme possédée par le client
s.eval('s -> _somme')
-> définit une variable s qui aliase _somme
s.eval('? s = 20')
-> sachant que s = _somme, est-il vrai que s = 20
(Réponse oui car _somme = 20)

"Soit q la quantité de pomme achetée. q est l'inconnue de ce problème"
s.eval('q -> _qte')
-> définit une variable q dont la valeur est inconnue
s.eval('? q = ?)
-> Sachant que q = _qte, est-il vrai que q est inconnue ?
(Réponse oui, car _qte = ? et que _qte est l'objectif de ce problème)

"D'après l'énoncé, on sait que s = p * q"
s.eval(s = p * q)
-> définit la relation entre s, p et q
s.eval('? s = p * q')
-> vérifie que cette relation soit bien correcte

'Alors, en remplaçant s et p par leur valeur, on obtient l'équation 20 = 5 * q'
s.eval('? 20 = 5 * q') 
-> vérifie que cette relation soit bien correcte

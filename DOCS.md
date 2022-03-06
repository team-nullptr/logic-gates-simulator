# Dokumentacja symulatora bramek logicznych

# Opis funkcjonalności

Ta sekcja zawiera opis funkcjonalności edytora bramek.

## Panel zarządzania projektami

Po uruchomieniu aplikacji znajdujemy się w panelu zarządzania projektami. Jest to miejsce, w którym możemy tworzyć, otwierać oraz usuwać nasze projekty. Panel zarządzania projektami składa się z nawigacji oraz listy projektów.

### Tworzenie projektu

Aby stworzyć nowy projekt klikamy guzik `Create project`, znajdujacy się w prawej części nawigacji.

<!-- TODO: [obrazek] -->

Jeżeli nie mamy stworzonego żadnego projektu, możemy również kliknąć w guzik `Create project` w sekcji poniżej.

<!-- TODO: [obrazek] -->

Po stworzeniu projektu jesteśmy automatycznie przenoszeni do edytora symulatora.

### Zmiana nazwy projektu

Stworzony projekt domyślnie nazywany jest `Untitled`. Oczywiście istnieje możliwość zmiany jego nazwy. Aby tego dokonać klikamy lewym przyciskiem myszy na nazwę projektu znajdującą się na jego karcie. Pozwala to na wpisanie nowej nazwy. Odklikniecie myszką w inne miejsce na ekranie, bądź wciśnięcie klawisza `enter` zatwierdza wprowadzone zmiany. Wciśnięcie klawisza `escape`. Jeżeli skasujemy nazwę, powrócia ona do poprzedniej zapisanej wartości.

<!-- TODO: [obrazek] -->

> Istnieje również druga opcja zmiany nazwy projektu, która zostanie opisana w sekcji opisu funkcjonalności edytora.

<!-- TODO: [obrazek] -->

### Usuwanie projektu

Aby usunąć projekt możemy kliknąć w ikonkę `X` w prawym górnym rogu karty projektu. Projekt zostaje wówczas usunięty na zawsze.

<!-- TODO: [obrazek] -->

## Edytor

Edytor pozwala na tworzenie nowych układów, symulowaniu ich oraz zapisywaniu do osobnych bloczków. Każdy projekt tworzony jest z pustym edytorem oraz dwoma podstawowymi bramkami logicznymi `and` oraz `not`.

Edytor składa się z obszaru roboczego, przybornika oraz nawigacji.

### Zarządzanie wejściami i wyjściami układu

#### _Dodawanie wejść i wyjść do układu_

Po najechaniu na żółty plus, znajdujący sie po lewej / prawej stronie obszaru roboczego, rozwija się lista, która pozwala dodać `1`, `2`, `4` lub `8` bitowe wejście / wyjście. Elementy początkowo mają stan `0` (wejścia są wyłączone, a wyjścia nie odbierają żadnego sygnału).

<!-- TODO: [obrazek] -->

Aby zmienić stan wejścia (pozwala to na testowanie układu w trakcie jego tworzenia) klikamy na nie lewym przyciskiem myszy. Kolor jasnofioletowy reprezentuje stan `0`, a kolor ciemno fioletowy stan `1`.

<!-- TODO: [obrazek] -->

#### _Zmiana nazwy wejść i wyjść_

Wejścia i wyjścia mają automatycznie przypisywaną nazwę (losowa litera angielskiego alfabetu). Można ją zmienić klikając w ikonkę ołówka, która znajduje się na samej górze obszaru wejść / wyjść. Elementy, które mogą mieć zmienioną nazwę zmieniają kolor na szary. Edycję możemy rozpocząć klikając w szare elementy. Podobnie jak w przypadku zmiany nazwy projektów, zatwierdzamy odkliknięciem w inne miejsce lub przyciskiem `enter`. Aby anulować nasze zmiany klikamy przycisk `escape`.

<!-- TODO: [obrazek] -->

#### _Zmiana kolejności ustawienia wejść i wyjść_

Obszary wejścia i wyjścia pozwalają również układać dodane elementy w odpowiadającej nam kolejności. Przytrzymanie lewego przycisku myszy na elemencie pozwala go przenieśc w miejsce innego elementu.

<!-- TODO: [obrazek] -->

#### _Usuwanie dodanych wejść i wyjść_

Aby usunąć wejście lub wyjście klikamy na nie rolką na myszy (scroll'em) lub lewym przyciskiem myszy przytrzymująć klawisz `alt` (`option` na komputerach od firmy apple).

### Edycja głównego układu

#### _Dodawanie bramek_

Aby dodać bramkę do układu przeciągamy ją (`drag and drop`) do obszaru roboczego. Bramka wyświetli się wówczas w miejscu gdzie została opuszona.

#### _Tworzenie połączeń_

Wejścia oraz wyjścia elementu w układzie zaznaczne są poprzez małe kropki po jego lewej oraz prawej stronie. Aby stworzyć połączenie między elementami układu wystarczy przytrzymać lewy przycisk myszy na wyjściu elementu oraz przeciągnąć kabelek do innego wejścia. W tym momencie stan wejścia do którego stworzyliśmy połącznie będzie zależny od stanu wyjścia bramki, od które połącznie zostało poprowadzone.

Kabelek zmienia kolor w zależności od tego na jaki stan ustawia wejście do którego jest podłączony. W przypadku gdy stan ten jest równy 0 kolor kabelka jest szary, a gdy 1 fioletowy.

#### _Usuwanie bramek z układu_

Usunięcie braki z układu działa identycznie jak usuwanie elementów wejścia i wyjścia. Klikamy rolkę na myszce albo lewy przycisk myszy przytrzymująć `alt` (`option` w przypadku komputerów od apple).

<!-- TODO: [obrazek] -->
### Nawigacja edytora

Nawigacja edytora posiada kilka ciekawych funkcjonalności, które są bardzo istotne podczas tworzenia układu.

#### _Porządkowanie układu_

Guzik porządkujący układ jest pierwszym guzikiem od prawej strony. Układa on elementy znajdujące się w obszarze roboczym w czytelny sposób.

#### _Wyświetlanie nazw wejść i wyjść elementów_

Przycisk pozwalający włączyć podgląd nazw wejść i wyjść znajduje się zaraz obok guzika do porządkowania elementów. Jest reprezentowany przez ikonkę oka. Nazwy wejść i wyjść bramki wyświetlają się obok nich.

#### _Zapisywanie stworzonych układów_

Przycisk `Create gate` pozwala na tworzenie nowych bramek z aktualnie stworzonego układu. Należy pamiętać, że każda stworzona bramka musi posiadać conajmniej jedno wejście i wyjście.

Po kliknięciu w przycisk wyświetli się formularz, w którym wpisujemy nazwę bramki i wybieramy kolor (jeżeli nie odpowiada nam wylosowany). Aby zapisać nowy element klikamy przycisk `submit`. Jeżli chcemy anulować tworzenie bramki klikamy w przycisk cancel, albo w lekko przyciemnione tło.

#### _Zmiana nazwy projektu bezpośrednio z edytora_

Aby zmienić nazwę projektu bezpośrednio z edytora klikamy w tytuł projektu po środku nawigacji. Zasady edycji są identyczne jak w panelu zarządzania projektami.

#### _Powrót do panelu zarządzania projektami_

Aby powrócić do panelu zarządzania projektami klikamy w ikonkę domu, po lewej stronie nawigacji.

### System edycji bramek

Aby wejść w tryb edycji bramki klikamy na nią podwójnym kliknięciem w przyborniku. Spowoduje to wyświetlenie edytowanej bramki (bramek, wejść i wyjść z jakich jest stworzona) w obszarze roboczym.

Po wejściu w tryb edycji bramki nawigacja zmienia swój kolor na jasnofioletowy. Obok nazwy projektu pojawia się nazwa edytowanej bramki.

#### _Edycja układu stworzonej bramki_

System edycji bramek pozwala zmieniać strukturę stworzonego elementu (dodawać nowe wejścia, wyjścia i bramki wewnętrzne). Należy pamiętać, że stworzona bramka, nie może korzystać z samej siebie oraz bramki w której jest wykorzystywana.

Aby zatwierdzić edycję klikamy w ikonke znacznika po lewej stronie nawigacji. Aby anulować edycję klikamy w strzałkę obok niego.

#### _Edycja nazwy stworzonej bramki_

Edycja nazwy stworzonej bramki wygląda identycznie jak w przypadku zmiany nazwy projektu (Klikamy w nazwę bramki na nawigacji).

## Dokumentacja techniczna

...

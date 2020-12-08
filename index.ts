import Element from "@heymarco/element";
import Control from "@heymarco/control";
import Modal from "@heymarco/modal";


export default class Navbar extends Control {
    constructor(selector : Selector) {
        super(selector);
    }



    get toggler() {
        return this.find(".toggler input[type=checkbox], input[type=checkbox].toggler");
    }


    get expanded() : boolean {
        return this.toggler.is(":checked");
    }
    set expanded(expanded : boolean) {
        this.toggler
        .filter(expanded ? ":not(:checked)" : ":checked")
        .prop("checked", !!expanded)
        .trigger("change")
        ;
    }

    markSticky(sticky : boolean) {
        this.toggleClass("sticky", sticky);
    }


    static togglerChangeHandler(event : MouseEvent) {
        const toggler = new Element(event.target as HTMLElement);
        const navbar = toggler.parents(".navbar").first();
        Modal.setActive((toggler.is(":checked") ? navbar : null));
    }

    static overlayClickHandler(event : MouseEvent) {
        const overlay = new Element(event.target as HTMLElement);
        const offset = overlay.offset()!;
        const mouseX = event.pageX - offset.left;
        const mouseY = event.pageY - offset.top;

        if ((mouseX < 0) || (mouseX > overlay[0].offsetWidth) && (mouseY < 0) || (mouseY > overlay[0].offsetHeight)) {
            const navbar = overlay.parents(".navbar").first();
            new Navbar(navbar).expanded = false;
        }
    }

    static navbarMinSet : boolean | null = null;
    static windowScrollHandler() {
        const position = Element.window.scrollTop()!;
        if (position >= 30) {
            if (this.navbarMinSet !== true) {
                this.navbarMinSet = true;

                new Navbar(".navbar").markSticky(true);
            }
        } else {
            if (this.navbarMinSet !== false) {
                this.navbarMinSet = false;

                new Navbar(".navbar").markSticky(false);
            }
        }
    }
}


Element.document.on("change", ".navbar .toggler input[type=checkbox], .navbar input[type=checkbox].toggler", (event) => Navbar.togglerChangeHandler(event as unknown as MouseEvent));
Element.document.on("click", ".navbar .links", (event) => Navbar.overlayClickHandler(event as unknown as MouseEvent));
Element.window.on("scroll", () => Navbar.windowScrollHandler());

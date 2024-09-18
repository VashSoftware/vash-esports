workspace {

    model {
        user = person "User" "A user of my system."

        softwareSystem = softwareSystem "Vash Software" "The main system for Vash Software."

        user -> softwareSystem "Uses"
    }

    views {
        systemContext softwareSystem {
            include *
            autolayout lr
        }

        theme default
    }
}

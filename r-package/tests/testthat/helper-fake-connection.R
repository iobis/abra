# A bare connection object, enough to build and inspect queries without a database
fake_con <- function(type = "open-data-local") {
    structure(
        list(details = list(type = type), connection = NULL),
        class = "robisdb_conn"
    )
}

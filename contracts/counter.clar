;; Define a map to store counts for each user
(define-map counters principal uint)

;; Get the current count for a user
(define-read-only (get-count (who principal))
  (default-to u0 (map-get? counters who))
)

;; Increment the count for the caller
(define-public (count-up)
  (let (
        (current-count (default-to u0 (map-get? counters tx-sender)))
        (new-count (+ current-count u1))
       )
    (map-set counters tx-sender new-count)
    (ok new-count)
)
)
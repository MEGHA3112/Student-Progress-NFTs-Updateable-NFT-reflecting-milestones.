;; Student Progress NFT -Updateable NFT reflecting milestones
;; Contract: student-progress-nft.clar
(define-non-fungible-token student-progress uint)

;; Error constants
(define-constant err-not-owner (err u100))
(define-constant err-invalid-milestone (err u101))
(define-constant err-token-exists (err u102))

;; Milestone data structure: maps token-id to a string
(define-map student-milestones uint (string-ascii 100))

;; Token ID counter
(define-data-var next-token-id uint u1)

;; Mint a new NFT for a student
(define-public (mint-student-nft (student principal) (milestone (string-ascii 100)))
  (let ((token-id (var-get next-token-id)))
    (begin
      ;; Ensure token ID does not already exist
      (asserts! (is-none (nft-get-owner? student-progress token-id)) err-token-exists)
      ;; Mint NFT to student
      (try! (nft-mint? student-progress token-id student))
      ;; Store milestone
      (map-set student-milestones token-id milestone)
      ;; Increment token ID counter
      (var-set next-token-id (+ token-id u1))
      (ok token-id)
    )
  )
)

;; Update a student's milestone (only NFT owner can update)
(define-public (update-milestone (token-id uint) (new-milestone (string-ascii 100)))
  (let ((owner (nft-get-owner? student-progress token-id)))
    (begin
      ;; Check if caller is owner of the token
      (asserts! (is-eq (unwrap! owner err-not-owner) tx-sender) err-not-owner)
      ;; Ensure new milestone string is not empty
      (asserts! (> (len new-milestone) u0) err-invalid-milestone)
      ;; Update milestone
      (map-set student-milestones token-id new-milestone)
      (ok true)
    )
  )
)

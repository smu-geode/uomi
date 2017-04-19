#If this is the first data inserted into the database
#then the ID given will be correct. Otherwise the ID will
#be incorrect 

ROOT="uomi.dev/api"
USERS="$ROOT/users/"
LOANS="$ROOT/loans/"
PAYMENTS="/payments"

#ID: 1
CALUM_EMAIL="caldrage@smu.edu"
CALUM_PASSWORD="adminadmin"

#ID: 2
JAKE_C_EMAIL="jcarlson@smu.edu"
JAKE_C_PASSWORD="adminadmin"

#ID: 3
JAKE_R_EMAIL="jwrowland@smu.edu"
JAKE_R_PASSWORD="adminadmin"

#ID: 4
JOHN_EMAIL="jbarr@smu.edu"
JOHN_PASSWORD="adminadmin"

#ID: 5
PAUL_EMAIL="pherz@smu.edu"
PAUL_PASSWORD="adminadmin"

#ID: 6
SAM_EMAIL="slefcourt@smu.edu"
SAM_PASSWORD="adminadmin"


curl --data "email=$CALUM_EMAIL&password=$CALUM_PASSWORD" $USERS
curl --data "email=$JAKE_C_EMAIL&password=$JAKE_C_PASSWORD" $USERS
curl --data "email=$JAKE_R_EMAIL&password=$JAKE_R_PASSWORD" $USERS
curl --data "email=$JOHN_EMAIL&password=$JOHN_PASSWORD" $USERS
curl --data "email=$PAUL_EMAIL&password=$PAUL_PASSWORD" $USERS
curl --data "email=$SAM_EMAIL&password=$SAM_PASSWORD" $USERS

#Create Loans

#ID 1-4
curl --data "to_user=1&from_user=4&amount_cents=4500&category=Food" $LOANS
curl --data "to_user=1&from_user=2&amount_cents=995&category=Misc" $LOANS
curl --data "to_user=3&from_user=1&amount_cents=854&category=Retail" $LOANS
curl --data "to_user=6&from_user=1&amount_cents=1599&category=Entertainment" $LOANS

#ID 5-8
curl --data "to_user=2&from_user=5&amount_cents=2299&category=Gas" $LOANS
curl --data "to_user=2&from_user=3&amount_cents=3595&category=Bills" $LOANS
curl --data "to_user=1&from_user=2&amount_cents=1245&category=Food" $LOANS
curl --data "to_user=4&from_user=2&amount_cents=523&category=Entertainment" $LOANS

#ID 9-12
curl --data "to_user=3&from_user=4&amount_cents=5492&category=Gas" $LOANS
curl --data "to_user=3&from_user=1&amount_cents=9983&category=Retail" $LOANS
curl --data "to_user=2&from_user=3&amount_cents=3588&category=Food" $LOANS
curl --data "to_user=6&from_user=3&amount_cents=341&category=Misc" $LOANS

#ID 13-16
curl --data "to_user=4&from_user=1&amount_cents=19900&category=Bills" $LOANS
curl --data "to_user=4&from_user=6&amount_cents=845&category=Misc" $LOANS
curl --data "to_user=2&from_user=4&amount_cents=4634&category=Gas" $LOANS
curl --data "to_user=3&from_user=4&amount_cents=930&category=Entertainment" $LOANS

#ID 17-20
curl --data "to_user=5&from_user=5&amount_cents=8873&category=Entertainment" $LOANS
curl --data "to_user=5&from_user=3&amount_cents=8843&category=Misc" $LOANS
curl --data "to_user=1&from_user=5&amount_cents=7645&category=Bills" $LOANS
curl --data "to_user=4&from_user=5&amount_cents=2569&category=Misc" $LOANS

#ID 21-24
curl --data "to_user=6&from_user=5&amount_cents=1553&category=Food" $LOANS
curl --data "to_user=6&from_user=3&amount_cents=7726&category=Retail" $LOANS
curl --data "to_user=1&from_user=6&amount_cents=15432&category=Food" $LOANS
curl --data "to_user=4&from_user=6&amount_cents=18848&category=Bills" $LOANS

echo $LOANS